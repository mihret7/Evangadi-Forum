import React, { useState } from "react";
import styles from "./signup.module.css";
import api from "../../Utility/axios"; // Restored axios instance import
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// The component accepts an `onToggle` function to switch back to the login form.
function SignUp({ onToggle }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
  });
  // State for handling both client-side and server-side errors
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handles input changes and clears previous errors for that field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear the specific error when the user starts typing again
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (errors.api) {
        setErrors((prev) => ({ ...prev, api: null }));
    }
  };

  // Handles form submission, validation, and API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // --- Client-side validation ---
    if (!formData.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.userName) newErrors.userName = "User name is required.";
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);

    // If there are validation errors, stop the submission
    if (Object.keys(newErrors).length > 0) return;

    // --- API call ---
    try {
      // Post data to the registration endpoint
      await api.post("/users/register", {
        username: formData.userName,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      // On success
      alert("Registration successful! Please sign in.");
      onToggle(); // << Use onToggle to switch to the login form
      
      // Clear the form data
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        userName: "",
        password: "",
      });

    } catch (error) {
      // Handle errors from the API (e.g., user already exists)
      setErrors({
        api: error.response?.data?.msg || "Registration failed. Please try again.",
      });
      console.error("Registration error:", error);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h2 className={styles.title}>Join the network</h2>
      <p className={styles.subtitle}>
        Already have an account?{" "}
        <a onClick={onToggle} className={styles.signInLink}>
          Sign in
        </a>
      </p>
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          required
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
        
        <div className={styles.nameRow}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className={`${styles.input} ${errors.firstName ? styles.inputError : ""}`}
            required
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className={`${styles.input} ${errors.lastName ? styles.inputError : ""}`}
            required
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        {(errors.firstName || errors.lastName) && (
          <div className={styles.errorMessage}>
            {errors.firstName || errors.lastName}
          </div>
        )}
        
        <input
          type="text"
          name="userName"
          placeholder="User Name"
          className={`${styles.input} ${errors.userName ? styles.inputError : ""}`}
          required
          value={formData.userName}
          onChange={handleChange}
        />
        {errors.userName && <div className={styles.errorMessage}>{errors.userName}</div>}

        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
        
        <p className={styles.agreeText}>
          I agree to the{" "}
          <a href="#" className={styles.link}>
            privacy policy
          </a>{" "}
          and{" "}
          <a href="#" className={styles.link}>
            terms of service
          </a>
          .
        </p>
        
        <button type="submit" className={styles.submitBtn}>
          Agree and Join
        </button>

        {errors.api && (
          <div className={`${styles.errorMessage} ${styles.apiError}`}>
            {errors.api}
          </div>
        )}

        <p className={styles.alreadyAccount}>
          <a onClick={onToggle} className={styles.link}>
            Already have an account?
          </a>
        </p>
      </form>
    </div>
  );
}

export default SignUp;

