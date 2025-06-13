import React, { useState } from "react";
import styles from "../../../src/Components/Header/style.module.css"; //

import logo from "../../assets/imgs/logo.png";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [mobile, setMobile] = useState(false);
  const navigate = useNavigate();

  const toggleMobile = () => {
    setMobile((prev) => !prev);
  };

  return (
    <section className={styles.header_container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src={logo} alt="ENGADI Logo" />
        </div>
        <div className={styles.navbar}>
          <nav
            className={`${styles.nav} ${styles.mobileNav} ${
              mobile ? styles.show : ""
            }`}
          >
            <Link to="/home">Home</Link>

            <div className={styles.howItWorksWrapper}>
              <Link to="#">How it works</Link>
              <div className={styles.tooltip}>
                {/* Discover how to ask and answer questions on Evangadi! */}
                <ol>
                  <li>Register or log in to your account.</li>
                  <li>Post your technical questions.</li>
                  <li>Other users browse and answer your questions.</li>
                  <li>Add helpful answers and engage in discussion.</li>
                </ol>
              </div>
            </div>
          </nav>
          <button
            className={styles.sign_in_btn}
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            SIGN IN
          </button>
          <div className={styles.menu_toggle} onClick={toggleMobile}>
            &#9776;
          </div>
        </div>
      </header>
    </section>
  );
};

export default Header;
