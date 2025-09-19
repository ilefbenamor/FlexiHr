import React from 'react';
import { signOut } from "firebase/auth"; 
import { auth } from '../FormulaireInsc/firebase'; 

function Logout() {
  const handleLogout = async () => {
    try {
      await signOut(auth); 
      console.log("Utilisateur déconnecté");
      window.location.href = "/"; 
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <div>
      <p>Déconnexion en cours...</p> 
      {handleLogout()}
    </div>
  );
}

export default Logout;
