import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import "./Signup.css"; // shared styles with Signup

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login clicked", email, password);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.msg);
        setError("");
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => navigate('../Dashboard.jsx'), 500);
      } else {
        setError(data.msg || data.error);
        setSuccess("");
      }
    } catch (err) {
      console.error(err);
      setError("Server error, try again later");
      setSuccess("");
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="left-panel">
          <div className="logo">Noteflow</div>
          <h2>Login now</h2>
          <p>Pick up your flow — log in now</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="submit-btn">
              Login
            </button>
          </form>

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <p className="footer-text">
            Don't have an account?{" "}
            <Link to="/signup">
              <span className="sign-in">Signup</span>
            </Link>
          </p>
        </div>

        <div className="right-panel">
          <img src="noteflow2.png" alt="noteflow" className="team-img" />
        </div>
      </div>
    </div>
  );
};

export default Login;
