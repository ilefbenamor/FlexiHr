import React, { useState } from "react";
import { auth, db } from "../FormulaireInsc/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const emailToQuery = email.toLowerCase();
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", emailToQuery));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("❌ Votre compte n'est pas enregistré.");
        return;
      }

      let userData = null;
      querySnapshot.forEach((doc) => {
        userData = doc.data();
      });

      if (userData.role !== "utilisateur") {
        setError("❌ Accès refusé. Vous n'êtes pas un utilisateur autorisé.");
        return;
      }

      // Authentification réussie
      const userCredential = await signInWithEmailAndPassword(auth, emailToQuery, password);
      console.log("✅ Connexion réussie :", userCredential.user);

      // Redirection vers le tableau de bord utilisateur
      navigate("/user-dashboard");
    } catch (error) {
      console.error("Erreur d'authentification :", error);
      setError("❌ Email ou mot de passe incorrect.");
    }
  };

  return (
    <div>
      <h2>Connexion Utilisateur</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default UserLogin;  