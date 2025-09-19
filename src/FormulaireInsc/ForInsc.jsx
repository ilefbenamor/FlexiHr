import React, { useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import './ForInsc.css';

function ForInsc() {
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordV, setPasswordV] = useState('');
  const [entreprise, setEntreprise] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (password !== passwordV) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    

    try {
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      const userData = {
        name,
        prenom,
        email,
        role: 'admin',
        entreprise,
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      
      const entrepriseRef = doc(db, 'entreprises', entreprise);
      const entrepriseSnapshot = await getDoc(entrepriseRef);

      if (!entrepriseSnapshot.exists()) {
        
        await setDoc(entrepriseRef, {
          name: entreprise,
          createdAt: new Date(),
          users: [],
        });
      }

      
      await setDoc(doc(db, 'entreprises', entreprise, 'users', user.uid), {
        name,
        prenom,
        email,
        role: 'admin',
      });

    
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      alert('Erreur : ' + error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Inscription Administrateur RH</h2>
      
      <p className="admin-info">
        Cette inscription est réservée aux responsables RH. Veuillez entrer vos informations professionnelles.
      </p>
      
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom"
          required
        />
        <input
          type="text"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          placeholder="Prénom"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email professionnel"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
        />
        <input
          type="password"
          value={passwordV}
          onChange={(e) => setPasswordV(e.target.value)}
          placeholder="Confirmez le mot de passe"
          required
        />
        <input
          type="text"
          value={entreprise}
          onChange={(e) => setEntreprise(e.target.value)}
          placeholder="Nom de l'entreprise"
          required
        />
        <button type="submit">Inscription</button>
      </form>
    </div>
  );
}

export default ForInsc;
