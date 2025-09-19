import React, { useEffect, useState } from "react";
import { auth, db } from "../FormulaireInsc/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import './ApprovedLeaves.css'; // Assurez-vous d'avoir un fichier CSS pour styliser la table

function ApprovedLeaves() {
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedLeaves = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) return;

        const adminQuery = query(collection(db, "users"), where("email", "==", user.email));
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
          const companyName = adminSnapshot.docs[0].data().entreprise;

          const approvedLeavesQuery = query(collection(db, "leaves"), where("entreprise", "==", companyName), where("status", "==", "approved"));
          const approvedLeavesSnapshot = await getDocs(approvedLeavesQuery);

          setApprovedLeaves(approvedLeavesSnapshot.docs.map(doc => doc.data()));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des congés approuvés :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedLeaves();
  }, []);

  if (loading) return <div>Chargement des congés approuvés...</div>;

  return (
    <div className="approved-leaves-container">
      <h2>Liste des Congés Approuvés</h2>
      <div className="table-container">
        {approvedLeaves.length > 0 ? (
          <table className="approved-leaves-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Date Début</th>
                <th>Date Fin</th>
              </tr>
            </thead>
            <tbody>
              {approvedLeaves.map((leave, index) => (
                <tr key={index}>
                  <td>{leave.employee}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.startDate}</td>
                  <td>{leave.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun congé approuvé trouvé.</p>
        )}
      </div>
    </div>
  );
}

export default ApprovedLeaves;
