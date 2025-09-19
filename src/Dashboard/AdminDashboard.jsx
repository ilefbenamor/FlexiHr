import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../FormulaireInsc/firebase";
import UserList from "./UserList";
import AddUserForm from "./AddUserForm";
import ToDoList from "./ToDoList";
import LeaveList from "./LeaveList";
import Logout from "./Logout";
import Reports from "./Reports";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

function AdminDashboard() {
  const [workersCount, setWorkersCount] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const adminQuery = query(collection(db, "users"), where("email", "==", user.email));
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
          const adminData = adminSnapshot.docs[0].data();
          const companyName = adminData.entreprise;

          const workersQuery = query(collection(db, "users"), where("role", "==", "utilisateur"), where("entreprise", "==", companyName));
          const workersSnapshot = await getDocs(workersQuery);
          setWorkersCount(workersSnapshot.size);

          const leavesQuery = query(collection(db, "leaves"), where("entreprise", "==", companyName), where("status", "==", "pending"));
          const leavesSnapshot = await getDocs(leavesQuery);
          setPendingLeaves(leavesSnapshot.size);

          const approvedLeavesQuery = query(collection(db, "leaves"), where("entreprise", "==", companyName), where("status", "==", "approved"));
          const approvedLeavesSnapshot = await getDocs(approvedLeavesQuery);
          setApprovedLeaves(approvedLeavesSnapshot.docs.map(doc => doc.data()));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="d-flex">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top w-100">
        <div className="container-fluid d-flex justify-content-between">
          <h1 className="fs-4 fw-bold text-gray-700 ms-3">Tableau de Bord RH</h1>
          <div className="d-flex align-items-center gap-3">
            <button className="btn position-relative">
              🔔<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"></span>
            </button>
            <div className="dropdown">
              <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i className="fas fa-user-circle fs-3"></i> {/* Icône utilisateur */}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/profile">👤 Profil</Link></li>
                <li><Link className="dropdown-item text-danger" to="/logout">🚪 Déconnexion</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="bg-light border-end p-3 vh-100 position-fixed" style={{ width: "250px", left: 0, top: "56px" }}>
  <h5 className="fw-bold">📌 Menu</h5>
  <Link className="nav-link py-2 d-flex align-items-center" to="/admin-dashboard/Add-user">
    <i className="fas fa-user-plus me-2"></i> Ajouter un Utilisateur
  </Link>
  <Link className="nav-link py-2 d-flex align-items-center" to="/admin-dashboard/leaves">
    <i className="fas fa-calendar-alt me-2"></i> Gestion des Congés
  </Link>
  
  <Link className="nav-link py-2 d-flex align-items-center" to="/admin-dashboard/user-list">
    <i className="fas fa-users me-2"></i> Liste des Utilisateurs
  </Link>
  <Link className="nav-link py-2 d-flex align-items-center" to="/admin-dashboard/approved-leaves">
    <i className="fas fa-check-circle me-2"></i> Congés Approuvés
  </Link>
</aside>


      {/* Contenu Principal */}
      <main className="flex-grow-1 p-4" style={{ marginLeft: "250px", marginTop: "70px" }}>
        <div className="container-fluid">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {/* Ajoute tes cartes ici */}
          </div>

          {/* Composants dynamiques */}
          <div className="mt-4">
            <Reports />
            <Routes>
              <Route path="/Add-user" element={<AddUserForm />} />
              
              <Route path="/admin-dashboard/user-list" element={<UserList />} />
              <Route path="/admin-dashboard/leaves" element={<LeaveList />} />
              <Route path="/admin-dashboard/approved-leaves" element={<approvedLeaves />} />

              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
