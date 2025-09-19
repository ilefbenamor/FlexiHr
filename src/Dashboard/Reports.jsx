import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../FormulaireInsc/firebase";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./reports.css";

function Reports() {
  const [leaveStats, setLeaveStats] = useState({ approved: 0, pending: 0, rejected: 0 });
  const [userStats, setUserStats] = useState(0);
  const [serviceStats, setServiceStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const adminQuery = query(collection(db, "users"), where("email", "==", user.email));
        const adminSnapshot = await getDocs(adminQuery);
        if (!adminSnapshot.empty) {
          const adminData = adminSnapshot.docs[0].data();
          const companyName = adminData.entreprise;

          
          const usersQuery = query(collection(db, "users"), where("entreprise", "==", companyName), where("role", "==", "utilisateur"));
          const usersSnapshot = await getDocs(usersQuery);

          let serviceCount = {};
          usersSnapshot.forEach(doc => {
            const poste = doc.data().poste || "Inconnu"; // Fallback si le poste est vide
            serviceCount[poste] = (serviceCount[poste] || 0) + 1;
          });

          setUserStats(usersSnapshot.size);
          setServiceStats(serviceCount);

          // 📌 Récupération des congés
          const leavesQuery = query(collection(db, "leaves"), where("entreprise", "==", companyName));
          const leavesSnapshot = await getDocs(leavesQuery);

          let approved = 0, pending = 0, rejected = 0;
          leavesSnapshot.forEach(doc => {
            const status = doc.data().status;
            if (status === "approved") approved++;
            else if (status === "pending") pending++;
            else if (status === "rejected") rejected++;
          });

          setLeaveStats({ approved, pending, rejected });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="reports-container">
      <div className="header">
        <h1>📊 Rapports Analytiques</h1>
        <p className="subtitle">Analyse des données RH de votre entreprise</p>
      </div>

      
      <div className="stats-container">
        <div className="card">
          <h4>👥 Nombre d'Employés</h4>
          <p className="stat-value">{userStats}</p>
        </div>
        <div className="card">
          <h4>✅ Congés Approuvés</h4>
          <p className="stat-value text-success">{leaveStats.approved}</p>
        </div>
        <div className="card">
          <h4>⏳ Congés en Attente</h4>
          <p className="stat-value text-warning">{leaveStats.pending}</p>
        </div>
        <div className="card">
          <h4>❌ Congés Rejetés</h4>
          <p className="stat-value text-danger">{leaveStats.rejected}</p>
        </div>
      </div>

      
      <div className="chart-container" style={{ height: "200px" }}> {/* Hauteur réduite */}
        <h3>📊 Répartition des Employés par Service</h3>
        <Bar
  data={{
    labels: Object.keys(serviceStats),
    datasets: [{
      label: "Répartition (%)",
      data: Object.values(serviceStats).map(count => (count / userStats) * 100), // 🔥 Normalisation en %
      backgroundColor: ["#3498db", "#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6", "#FF5733"],
    }]
  }}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100, 
        title: { display: true, text: "Pourcentage d'Employés" },
      },
    },
  }}
/>

      </div>
    </div>
  );
}

export default Reports;
