// src/Pages/Landing/Landing.js

import React, { useState } from "react";
import Login from "../../Components/Login/Login";
import SignUp from "../../Components/SignUp/SignUp";
import styles from "./landing.module.css";
import About from "../../Components/About/About";
import LayOut from "../../Components/Layout/Layout";

function Landing() {
  const [showSignUp, setShowSignUp] = useState(false);

  const toggleForm = () => {
    setShowSignUp((prev) => !prev);
  };

  return (
    <LayOut>
      <div className={styles.pageContainer}>
        <main className={styles.mainContent}>
          {/* Form Section with Animation Container */}
          <section className={styles.formSection}>
            {/* 1. This is the main container with the shadow and fixed height */}
            <div className={styles.formAnimationContainer}>
              {/* 2. This inner container will slide left and right */}
              <div
                className={`${styles.formSlider} ${
                  showSignUp ? styles.showSignUp : ""
                }`}
              >
                {/* 3. Each form is a "slide" */}
                <div className={styles.formSlide}>
                  <Login onToggle={toggleForm} />
                </div>
                <div className={styles.formSlide}>
                  <SignUp onToggle={toggleForm} />
                </div>
              </div>
            </div>
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