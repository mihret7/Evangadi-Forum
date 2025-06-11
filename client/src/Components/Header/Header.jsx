import React, { useState } from "react";
import "./style.css";
import logo from "../../assets/imgs/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Context/userContext";

const Header = () => {
  const [userData, setUserData] = useContext(UserContext);
  const [mobile, setMobile] = useState(false);
  const navigate = useNavigate()

  const toggleMobile = () => {
    setMobile((prev) => !prev);
  };


  const logout = () => {
    setUserData(null);
    localStorage.setItem("token", "");
    navigate("/landing");
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="ENGADI Logo" />
      </div>

      <nav className={`nav mobile-nav ${mobile ? "show" : ""}`}>
        <Link to="/home">Home</Link>
        <Link to="#">How it works</Link>
      </nav>

       {userData ? (
        <button onClick={logout} className="sign-in-btn">
          LOGOUT
        </button>
      ) : (
        <Link to="/landing">
          <button className="sign-in-btn">SIGN IN</button>
        </Link>
      )}

      <div className="menu-toggle" onClick={toggleMobile}>
        &#9776;
      </div>
    </header>
  );
};

export default Header;
