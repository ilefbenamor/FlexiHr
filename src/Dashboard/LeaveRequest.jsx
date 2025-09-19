import React, { useState } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../FormulaireInsc/firebase";

function LeaveRequest() {
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      alert("Utilisateur non connecté !");
      return;
    }

    try {
      // 1. Récupérer les informations de l'utilisateur connecté
      const userSnapshot = await getDocs(query(collection(db, "users"), where("email", "==", user.email)));
      
      if (userSnapshot.empty) {
        alert("Utilisateur non trouvé !");
        return;
      }

      const userData = userSnapshot.docs[0].data();
      const entreprise = userData.entreprise;

      // 2. Trouver l'admin de la même entreprise
      const adminSnapshot = await getDocs(query(collection(db, "users"), where("entreprise", "==", entreprise), where("role", "==", "admin")));

      if (adminSnapshot.empty) {
        alert("Aucun administrateur trouvé pour cette entreprise !");
        return;
      }

      const adminEmail = adminSnapshot.docs[0].data().email;

      // 3. Ajouter la demande de congé
      await addDoc(collection(db, "leaves"), {
        employee: user.email,
        entreprise,
        reason,
        startDate,
        endDate,
        status: "pending", // Demande en attente
        adminEmail, // Email de l'admin
      });

      alert("Demande envoyée !");
    } catch (error) {
      console.error("Erreur :", error);
      setError("Une erreur s'est produite !");
    }
  };

  return (
    <div>
      <h2>📅 Demande de congé</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Raison :</label>
        <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} required />

        <label>Date de début :</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />

        <label>Date de fin :</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />

        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

export default LeaveRequest;
