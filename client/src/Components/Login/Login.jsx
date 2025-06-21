import React, { useContext, useEffect, useState } from "react";
// Used to access shared data like userData globally from a central UserContext.
import styles from "./login.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
// useLocation  tells current route, often useful when redirecting back after login.
import api from "../../Utility/axios";
import { UserContext } from "../Context";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useOnlineStatus } from "../Context/OnlineStatusContext";

function Login() {
  const location = useLocation(); //Gets the current route's location info.
  const { userData, setUserData } = useContext(UserContext);
  // Pulls in the current user data (userData) and a function to update it (setUserData).
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };
  // Case 1: Typing in Email Input
  // name = "email";
  // value = "hakim@example.com";

  // setFormData((prev) => ({
  //   ...prev, // { email: "", password: "" }
  //   email: "hakim@example.com",
  // }));

  //result
  // formData = { email: "hakim@example.com", password: "" };

  // Case 2: Typing in Password Input
  // name = "password";
  // value = "123456";
  // setFormData((prev) => ({
  //   ...prev, // { email: "hakim@example.com", password: "" }
  //   password: "123456",
  // }));

  //result
  // formData = { email: "hakim@example.com", password: "123456" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOnline) {
      toast.error("You must be online to log in.");
      return;
    }
    setLoading(true);
    setError(""); // Clear previous inline errors like invalid email or password

    // Basic validation
    if (!formData.email) {
      toast.warn("Please enter your email.");
      setLoading(false); //spinner will not be shown the above warning will be shown
      return;
    }
    if (!formData.password) {
      toast.warn("Please enter your password.");
      setLoading(false);
      return;
    }

    // formData contains:
    // email: "hakim@example.com"
    // password: "123456"
    // Now we can send formData to the server endpoint for login
    try {
      const response = await api.post("/user/login", formData);

      setUserData({
        userid: response.data.userid, // Fixed response structure
        username: response.data.username,
        email: response.data.email,
        token: response.data.token,
        firstname: response.data.first_name,
      });
      // Assuming the response structure is like this:
      // {
      //   "userid": 5,
      //   "username": "hakimchu",
      //   "email": "hakim@example.com",
      //   "token": "eyJhbGciOiJIUzI1NiIsInR...",
      //   "first_name": "Hakim"
      // }
      // Once this is saved to context, any page using useContext(UserContext) now has access to this user!

      navigate("/home");
      toast.success("Logged in successfully!");
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (error.response?.status === 401) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.response?.status === 404) {
        errorMessage = "User not found. Please register first.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  // Flips showPassword

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2 className={styles.loginTitle}>Login to your account</h2>
        <p className={styles.createAccountPrompt}>
          Don't have an account?{" "}
          <a
            onClick={() => navigate("/sign-up")}
            className={styles.createAccountLink}
          >
            Create a new account
          </a>
        </p>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <div className={styles.formGroup}>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            disabled={loading}
          />
        </div>
        <div className={styles.formGroup}>
          <div className={styles.passwordInputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              // false          type="password"           Masked (••••••)
              // true            type="text"              Visible (abc123)
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your Password"
              required
              disabled={loading}
            />
            <span
              className={styles.passwordToggle}
              onClick={togglePasswordVisibility} //which changes the value of showPassword
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              {/* false             <FiEye />              // Show password icon
                  true                 <FiEyeOff />              // Hide password icon */}
            </span>
          </div>
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
          // setLoading(true) is called
          // This makes disabled={true}, which:
          // Prevents multiple clicks
          // Prevents sending the form again
          // Shows a loader (Logging in... text with spinner)
        >
          {loading ? (
            // If loading is true, render the span block
            // If loading is false, render "Submit" text   Initial Render (loading = false): User sees: "Submit"

            // After Clicking Submit (loading = true):
            // This replaces "Submit" with: 	Ensures spinner and  Logging in... are centered & aligned

            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                justifyContent: "center",
              }}
            >
              <ClipLoader color={"var(--white)"} loading={loading} size={20} />
              Logging in...
            </span>
          ) : (
            "Submit"
          )}
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

export default Login;
