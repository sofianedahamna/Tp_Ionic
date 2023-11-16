import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import CurrentPageIndicator from './CurrentPageIndicator';// Assurez-vous que le chemin vers votre fichier CSS est correct

const Header = ({ onSearchSubmit }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    // Redirigez l'utilisateur si nécessaire, par exemple vers la page d'accueil
  };

  return (
    <div className="hearders bg-success mb-5"> 
      <nav className="navbar navbar-light justify-content-around">
        <a className="navbar-brand" href="/">
          <img src="/greencharge-removebgLogo2.png" className="rounded float-left" alt="Logo green charge" />
        </a>
        <div className="d-flex flex-grow-2 align-items-center w-50"> 
          <CurrentPageIndicator onSearchSubmit={onSearchSubmit} />
        </div>
        <Link to="/add-station" className='navbar-text'>Mettre ma borne sur greencharge</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
      </nav>
      <div className="collapse" id="navbarToggleExternalContent">
        <div className="bg-dark p-4">
          {!isLoggedIn ? (
            <>
              <li><Link to="/login" className='navbar-text text-white'>Connexion</Link></li>
              <li><Link to="/signup" className='navbar-text text-white'>Inscription</Link></li>
            </>
          ) : (
            <li><button onClick={handleLogout} className='navbar-text text-white'>Déconnexion</button></li>
          )}
        </div>
      </div>
      <hr />
    </div>
  );
}

export default Header;
