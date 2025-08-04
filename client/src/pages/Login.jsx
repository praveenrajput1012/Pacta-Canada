import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await API.post("/api/auth/login", form);
      const data = res.data;

      // Save token and user info to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/"); // Redirect to home or dashboard
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Login failed. Server error.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Login</h2>
      {message && <div style={{ marginBottom: 12, color: "blue" }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 16 }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: 8, background: "#1976d2", color: "#fff", border: "none", borderRadius: 4 }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
