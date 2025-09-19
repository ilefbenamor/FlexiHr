import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <div className="header-container" id="Header">
      <nav>
        <div className="logo">
          <span className="dots">..</span>
          <span className="flexi-title">FlexiHr</span>
        </div>
        <div className="nav-links">
          <a href="#Header">Accueil</a>
          <a href="#Services">Services</a>
          <a href="#Footer">Contact</a>
          
          <Link to="/login">
            <button type="submit">Connexion</button>
          </Link>
          <Link to="/user-login">
              <button type="submit">Espace Utilisateur</button>
          </Link>
        </div>
      </nav>

      <section className="section1">
        <div className="content">
          <h1>Bienvenue sur notre plateforme</h1>
          <p>
            Notre plateforme RH optimise la gestion des congés et des utilisateurs.
          </p>
          
          <Link to="/signup">
            <button type="submit">S'inscrire</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Header;
