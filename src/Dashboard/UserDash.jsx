import React, { useState, useEffect } from 'react';
import { auth, db } from "../FormulaireInsc/firebase";
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './userDash.css';

function UserDash() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [takenLeaves, setTakenLeaves] = useState(0);
  const [remainingLeaves, setRemainingLeaves] = useState(20);
  const [showMenu, setShowMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      fetchLeaveStats(currentUser.email);
    }
  }, [navigate]);

  const fetchLeaveStats = async (userEmail) => {
    const leavesRef = collection(db, 'leaves');
    const q = query(leavesRef, where('employee', '==', userEmail));
    const querySnapshot = await getDocs(q);

    let totalTakenLeaves = 0;
    
    querySnapshot.forEach((doc) => {
      const leave = doc.data();
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const leaveDays = (endDate - startDate) / (1000 * 3600 * 24);

      if (leave.status === 'approved') {
        totalTakenLeaves += leaveDays;
      }
    });

    setTakenLeaves(totalTakenLeaves);
    setRemainingLeaves(20 - totalTakenLeaves);
    
    // Example notifications based on leave status
    setNotifications([
      "Vous avez un congé approuvé pour la semaine prochaine.",
      "Assurez-vous d'utiliser vos congés restants avant la fin de l'année.",
      "Rappelez-vous de soumettre vos demandes de congé à temps."
    ]);
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <div className="user-dashboard">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container-fluid d-flex justify-content-between">
          <h1 className="fs-4 fw-bold text-gray-700 ms-3">Tableau de Bord</h1>
          <div className="d-flex align-items-center gap-3">
            <div className="user-menu-container" onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)}>
              <button className="btn btn-link">
                <FaUserCircle size={30} />
              </button>
              {showMenu && (
                <div className="user-menu">
                  <p>{user?.email}</p>
                  <button className="btn btn-danger" onClick={handleLogout}>
                    🚪 Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mt-5 pt-5">
        <div className="row">
          <div className="col-md-4">
            <div className="profile-card card shadow-sm">
              <div className="card-body text-center">
                <FaUserCircle size={80} className="text-primary" />
                <h3 className="card-title mt-3">{user?.email}</h3>
                <p className="card-text">Employé</p>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="stats-cards row">
              <div className="col-md-6 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">📅 Congés Pris</h5>
                    <p className="card-text fs-3">{takenLeaves} jours</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">🗓 Congés Restants</h5>
                    <p className="card-text fs-3">{remainingLeaves} jours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-buttons text-center">
              <button className="btn btn-primary" onClick={() => navigate('/leave-request')}>Demander un congé</button>
              <button className="btn btn-outline-secondary" onClick={() => navigate('/user-leaves')}>Voir mes congés</button>
            </div>
          </div>
        </div>

        {/* New Section for Alerts/Warnings/Notifications */}
        <div className="notifications mt-4">
          <h4>Notifications</h4>
          <ul>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <li key={index} className="alert alert-info">
                  {notification}
                </li>
              ))
            ) : (
              <li>Aucune notification pour l'instant</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserDash;
