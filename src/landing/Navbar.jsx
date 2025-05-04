// frontend/src/landing/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Navbar.css';
import LoginModal from "../Auth/LoginModal";
import RegisterModal from "../Auth/RegisterModal";

const Navbar = ({ isAuthenticated, setIsAuthenticated, user }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">travel.withme</Link>

          <div className="navbar-links">
            {/* <Link to="/support" className="navbar-link">Поддержка</Link> */}

            {!isAuthenticated ? (
              <>
                <button className="navbar-link" onClick={() => setShowLogin(true)}>Войти</button>
                <button className="navbar-button" onClick={() => setShowRegister(true)}>Регистрация</button>
              </>
            ) : (
              <>

                <Link to="/profile" className="navbar-button">Профиль</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setIsAuthenticated(true);
            setShowLogin(false);
          }}
        />
      )}

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSuccess={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
