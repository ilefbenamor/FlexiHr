import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth, db } from "./FormulaireInsc/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "bootstrap/dist/js/bootstrap.bundle.min";

import Header from "./Header/Header";
import Services from "./Services/Services";
import Footer from "./Footer/Footer";
import LoginForm from "./FormulaireInsc/LoginForm";
import SignUpForm from "./FormulaireInsc/ForInsc";
import AdminDashboard from "./Dashboard/AdminDashboard";
import UserDash from "./Dashboard/UserDash";
import ToDoList from "./Dashboard/ToDoList";
import AddUserForm from "./Dashboard/AddUserForm";
import UserList from "./Dashboard/UserList";
import Logout from "./Dashboard/Logout";
import UserLogin from "./Dashboard/UserLogin";
import LeaveRequest from "./Dashboard/LeaveRequest";
import LeaveList from "./Dashboard/LeaveList";
import UserLeaves from "./Dashboard/UserLeaves";
import ApprovedLeaves from "./Dashboard/ApprovedLeaves"; // ✅ Importation du composant

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUser(currentUser);
            setRole(userDoc.data().role);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du rôle :", error);
        }
      } else {
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Chargement...</div>;
  }

  function ProtectedRoute({ element, roleRequired }) {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (role && roleRequired) {
      if (roleRequired === "utilisateur") {
        return role === roleRequired ? element : <Navigate to="/admin-dashboard" replace />;
      } else {
        return role === roleRequired ? element : <Navigate to="/user-dashboard" replace />;
      }
    }
    return element;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={role === "admin" ? "/admin-dashboard" : "/user-dashboard"} replace />
            ) : (
              <>
                <Header />
                <Services />
                <Footer />
              </>
            )
          }
        />
        <Route path="/login" element={!isAuthenticated ? <LoginForm /> : <Navigate to={role === "admin" ? "/admin-dashboard" : "/user-dashboard"} replace />} />
        <Route path="/signup" element={!isAuthenticated ? <SignUpForm /> : <Navigate to={role === "admin" ? "/admin-dashboard" : "/user-dashboard"} replace />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} roleRequired="admin" />} />
        <Route path="/admin-dashboard/add-user" element={<ProtectedRoute element={<AddUserForm />} roleRequired="admin" />} />
        <Route path="/admin-dashboard/user-list" element={<ProtectedRoute element={<UserList />} roleRequired="admin" />} />
        <Route path="/admin-dashboard/leaves" element={<ProtectedRoute element={<LeaveList />} roleRequired="admin" />} />
        <Route path="/admin-dashboard/approved-leaves" element={<ProtectedRoute element={<ApprovedLeaves />} roleRequired="admin" />} />
        <Route path="/user-dashboard" element={<ProtectedRoute element={<UserDash />} roleRequired="utilisateur" />} />
        <Route path="/admin-dashboard/tasks" element={<ProtectedRoute element={<ToDoList />} roleRequired="utilisateur" />} />
        <Route path="/leave-request" element={<ProtectedRoute element={<LeaveRequest />} />} />
        <Route path="/user-leaves" element={<ProtectedRoute element={<UserLeaves />} />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<h2>Page non trouvée</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
