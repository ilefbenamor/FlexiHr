import React, { useState, useEffect } from "react";
import { auth, db } from "../FormulaireInsc/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function AddUserForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "utilisateur",
    entreprise: "",
    poste: "",
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      const adminUid = auth.currentUser?.uid;
      if (!adminUid) return;
      const adminDoc = await getDoc(doc(db, "users", adminUid));
      if (adminDoc.exists()) {
        setUser((prevUser) => ({
          ...prevUser,
          entreprise: adminDoc.data()?.entreprise || "",
        }));
      }
    };
    fetchAdminData();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const newUser = userCredential.user;

      
      await setDoc(doc(db, "users", newUser.uid), {
        name: user.name,
        email: user.email,
        role: "utilisateur",
        entreprise: user.entreprise,
        poste: user.poste,
      });

      alert("Utilisateur ajouté avec succès !");
      
      
   //   await signInWithEmailAndPassword(auth, user.email, user.password);

      
     // navigate("/user-dashboard");

    } catch (error) {
      alert("Erreur : " + error.message);
    }
  };

  return (
    <div className="form-container">
      <h1>Ajouter un utilisateur</h1>
      <form onSubmit={handleSubmit}>
        <label>Nom : <input type="text" name="name" value={user.name} onChange={handleChange} required /></label>
        <label>Email : <input type="email" name="email" value={user.email} onChange={handleChange} required /></label>
        <label>Mot de passe : <input type="password" name="password" value={user.password} onChange={handleChange} required /></label>
        <label>Poste : <input type="text" name="poste" value={user.poste} onChange={handleChange} required /></label>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

export default AddUserForm;
