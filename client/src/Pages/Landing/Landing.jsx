import React from "react";
import Login from "../../Components/Login/Login";
import styles from "./landing.module.css";
import About from "../../Components/About/About";
import LayOut from "../../Components/Layout/Layout";

function Landing() {
  return (
    <LayOut>
      <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        {/* Login Form Section */}
        <section className={styles.loginSection}>
          <Login />
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
