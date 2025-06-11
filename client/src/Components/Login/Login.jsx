import React, { useState } from "react";
import styles from "./login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/userContext";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import axios from "../../Utility/axios";

function Login() {
  const [userData, setUserData] = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [response, setResponse] = useState();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post('/users/login',{
          email : formData.email,
          password:formData.password
      }).then((data)=>{
          if(data.data.token===undefined){
            setResponse(data.data)
          }else{
            let decodedToken = jwtDecode(data.data.token); 
            setUserData({
              token: data.data.token,
              user: decodedToken.username,
            });
            localStorage.setItem('token',data.data.token)
            navigate('/home')
          }
      })
  } catch (error) {
      console.log(error.message)
  }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };



  if(response){
    return (
      <div className={styles.msg}>
        <h1 className={styles.note}>{response.message}</h1>
        <Link className={styles.nav_to} to={"/landing"}>
          {"Go to login/signup "}
        </Link>
      </div>
    );
  
  }else{
  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.loginTitle}>Login to your account</h2>
      <p className={styles.createAccountPrompt}>
        Don't have an account? <a 
          onClick={() => navigate("/sign-up")}
          className={styles.createAccountLink}
        >
          Create a new account
        </a>
      </p>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <div className={styles.passwordInputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your Password"
              required
            />
            <span className={styles.passwordToggle} onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />} 
            </span>
          </div>
        </div>
        <button type="submit" className={styles.submitButton}>
          submit
        </button>
        <a 
          onClick={() => navigate("/sign-up")}
          className={styles.createAccountLinkBottom}
        >
          Create an account?
        </a>
      </form>
    </div>
  );
}
}

export default Login; 
