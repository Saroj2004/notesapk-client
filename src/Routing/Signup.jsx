import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.msg || "Signup successful!");
        setError("");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setError(data.msg || data.error || "Signup failed");
        setSuccess("");
      }
    } catch (err) {
      setError("Server error, try again later");
      setSuccess("");
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="left-panel">
          <div className="logo">Noteflow</div>
          <h2>Create an account</h2>
          <p>Create your first note today</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="submit-btn">Submit</button>
          </form>

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <p className="footer-text">
            Have an account? <Link to="/login"><span className="sign-in">Login</span></Link>
          </p>
        </div>

        <div className="right-panel">
          <img src="noteflow2.png" alt="noteflow" className="team-img" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
