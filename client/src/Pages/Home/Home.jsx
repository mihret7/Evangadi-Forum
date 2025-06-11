import React from "react";
import styles from "./home.module.css";
import { useState, useEffect, useContext } from "react";
import axios from "../../Utility/axios";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import LayOut from "../../Components/Layout/Layout"
import { UserContext } from "../../Components/Context/userContext";

function Home() {
  const token = localStorage.getItem("token");
  console.log(token);
  const [userData, setUserData] = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [userProfile, setUserProfile] = useState([]);
  const navigate = useNavigate()


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("/users/user-profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        console.log(data.data.profile)
        setUserProfile(data.data.profile);
        return axios.get("/users/all-question", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        setQuestions(res.data.question);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        // logout on error
        localStorage.removeItem("token");
        navigate("/landing");
      });
  }, []);
  
  






  return (
    <LayOut>
      <section className={styles.main_container}>
        <div className={styles.homepage_container}>
          <div className={styles.upper_section}>
            <div className={styles.title}>
              <Link to="/ask-questions" className={styles.btn}>
                <p>Ask Question</p>
              </Link>
              {/* get user name from state */}
              <p>Welcome: {userProfile[0]?.user_name}</p>
            </div>
            <h1 className={styles.questions_list}>Questions</h1>
          </div>
          {questions.map((q) => (
            <Link
              to={`/question-detail/${q.question_id}/${q.user_id}`}
              className={styles.link_container}
            >
              <div key={q.question_id}>
                <div className={styles.user_container}>
                  <div className={styles.user_question}>
                    <div className={styles.usericon_and_username}>
                      <div className={styles.inner_center}>
                        <FaUserCircle size={80} className={styles.usericon} />
                        <span>{q.user_name}</span>
                      </div>
                    </div>
                    <p className={styles.title}>{q.question_title}</p>
                  </div>
                  <FaChevronRight size={20} className={styles.chevron} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </LayOut>
  );
}

export default Home;
