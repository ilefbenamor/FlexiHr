import React, { useState, useEffect } from "react";
import { auth, db } from "../FormulaireInsc/firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import './UserLeaves.css'; // Import du fichier CSS

function UserLeaves() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "leaves"), where("employee", "==", user.email));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leaveData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeaves(leaveData);
    });

    return () => unsubscribe(); // Arrête l'écoute quand on quitte la page
  }, []);

  const handleCancelLeave = async (leaveId) => {
    try {
      await deleteDoc(doc(db, "leaves", leaveId));
      console.log("Demande de congé annulée avec succès.");
    } catch (error) {
      console.error("Erreur lors de l'annulation de la demande :", error);
    }
  };

  return (
    <div className="user-leaves-container">
      <h2>📌 Mes demandes de congé</h2>
      {leaves.length === 0 ? (
        <p className="no-leaves-message">Aucune demande enregistrée.</p>
      ) : (
        <table className="user-leaves-table">
          <thead>
            <tr>
              <th>Date de début</th>
              <th>Date de fin</th>
              <th>Raison</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                <td>{leave.reason}</td>
                <td>
                  <strong className={`status ${leave.status}`}>
                    {leave.status === "approved"
                      ? "✅ Approuvé"
                      : leave.status === "rejected"
                      ? "❌ Refusé"
                      : "⏳ En attente"}
                  </strong>
                </td>
                <td>
                  <button 
                    className="cancel-btn" 
                    onClick={() => handleCancelLeave(leave.id)}>
                    Annuler
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserLeaves;
