import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

const ADMIN_EMAIL = "admin@eventhub.com";
const ADMIN_PASSWORD = "Admin@123";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("adminLoggedIn", "true");

      navigate("/admin-dashboard");
    } else {
      setError("Invalid admin email or password");
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-icon">
          🔐
        </div>

        <h1>Admin Sign In</h1>

        <p className="admin-subtitle">
          Secure access for authorized administrators
        </p>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Admin Email</label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <div className="password-box">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>
          </div>

          {error && (
            <p className="login-error">
              ⚠ {error}
            </p>
          )}

          <button type="submit" className="admin-login-btn">
            Sign In
          </button>

        </form>

        <div className="admin-security">
          <span>🛡</span>
          <p>Only authorized administrators can access this panel.</p>
        </div>

      </div>

    </div>
  );
};

export default AdminLogin;