 // src/Pages/Landing/Landing.js

import React, { useState } from "react";
import Login from "../../Components/Login/Login";
import SignUp from "../../Components/SignUp/SignUp";
import styles from "./landing.module.css";
import About from "../../Components/About/About";
import LayOut from "../../Components/Layout/Layout";

function Landing() {
  // State to toggle between Login and SignUp forms
  const [showSignUp, setShowSignUp] = useState(false);

  // Function to toggle the view
  const toggleForm = () => {
    setShowSignUp((prev) => !prev);
  };

  return (
    <LayOut>
      <div className={styles.pageContainer}>
        <main className={styles.mainContent}>
          {/* Form Section (conditionally renders Login or SignUp) */}
          <section className={styles.formSection}>
            {showSignUp ? (
              <SignUp onToggle={toggleForm} />
            ) : (
              <Login onToggle={toggleForm} />
            )}
          </section>

          {/* About Section */}
          <section className={styles.aboutSection}>
            <About />
          </section>
        </main>
      </div>
    </LayOut>
  );
}

export default Landing;

