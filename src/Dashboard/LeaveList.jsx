import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../FormulaireInsc/firebase";
import './LeaveList.css';

function LeaveList() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [userEntreprise, setUserEntreprise] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      alert("Utilisateur non connecté !");
      return;
    }

    const fetchUserEntreprise = async () => {
      const usersRef = collection(db, "users");
      const userSnapshot = await getDocs(query(usersRef, where("email", "==", user.email)));
      
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        setUserEntreprise(userData.entreprise); 
      } else {
        alert("Utilisateur non trouvé dans la base de données !");
      }
    };

    fetchUserEntreprise();
  }, []);

  useEffect(() => {
    if (userEntreprise) {
      const q = query(
        collection(db, "leaves"),
        where("entreprise", "==", userEntreprise),
        where("status", "==", "pending")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaveRequests(requests);
      });

      return () => unsubscribe();
    }
  }, [userEntreprise]);

  const updateLeaveStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "leaves", id), { status });
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  return (
    <div className="leave-list-container">
      <h2>📋 Gestion des Congés</h2>
      {leaveRequests.length === 0 ? (
        <p>Aucune demande en attente.</p>
      ) : (
        <table className="leave-table">
          <thead>
            <tr>
              <th>Employé</th>
              <th>Raison</th>
              <th>Dates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.employee}</td>
                <td>{req.reason}</td>
                <td>{req.startDate} → {req.endDate}</td>
                <td>
                  <button onClick={() => updateLeaveStatus(req.id, "approved")}>✅ Accepter</button>
                  <button onClick={() => updateLeaveStatus(req.id, "rejected")}>❌ Refuser</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LeaveList;
