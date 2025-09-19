import React, { useState, useEffect } from "react";
import { auth, db } from "../FormulaireInsc/firebase";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  deleteDoc
} from "firebase/firestore";
import "./UserList.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminCompany, setAdminCompany] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const adminUid = auth.currentUser?.uid;
        if (!adminUid) {
          console.warn("❌ Aucun admin connecté !");
          setLoading(false);
          return;
        }

        const adminDocRef = doc(db, "users", adminUid);
        const adminDoc = await getDoc(adminDocRef);

        if (!adminDoc.exists()) {
          console.error("❌ L'admin connecté n'existe pas dans Firestore !");
          setLoading(false);
          return;
        }

        const adminData = adminDoc.data();
        const companyName = adminData?.entreprise || null;

        if (!companyName) {
          console.error("❌ Le champ 'entreprise' est manquant pour cet admin !");
          setLoading(false);
          return;
        }

        setAdminCompany(companyName);

        const usersCollectionRef = collection(db, "users");
        const q = query(
          usersCollectionRef,
          where("entreprise", "==", companyName),
          where("role", "==", "utilisateur")
        );

        const querySnapshot = await getDocs(q);
        const usersList = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          usersList.push({
            id: doc.id,
            nom: userData.name,
            email: userData.email,
            poste: userData.poste || "Non spécifié",
            dateAjout: userData.dateAjout || "Date inconnue",
          });
        });

        setUsers(usersList);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des utilisateurs :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter((u) => u.id !== userId));
      alert("Utilisateur supprimé !");
    } catch (error) {
      console.error("Erreur de suppression :", error);
      alert("Erreur lors de la suppression.");
    }
  };

  if (loading) return <div>Chargement des utilisateurs...</div>;

  return (
    <div className="user-list-container">
      <h2>Liste des utilisateurs de {adminCompany || "l'entreprise inconnue"}</h2>
      {users.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Poste</th>
              <th>Date d'ajout</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.nom}</td>
                <td>{user.email}</td>
                <td>{user.poste}</td>
                <td>{user.dateAjout}</td>
                <td>
                  <button onClick={() => handleDelete(user.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun utilisateur trouvé dans cette entreprise.</p>
      )}
    </div>
  );
}

export default UserList;
