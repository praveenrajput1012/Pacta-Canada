import React, { useState } from "react";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // default role
  });
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful! You can now log in.");
        setForm({ username: "", email: "", password: "", role: "user" });
      } else {
        setMessage(data.message || "Signup failed.");
      }
    } catch (err) {
      setMessage("Signup failed. Server error.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Sign Up</h2>
      {message && <div style={{ marginBottom: 12, color: "blue" }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </div>
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
            style={{ width: "100%", marginBottom: 8 }}
          />
        </div>
        <div>
          <label>Role:</label>
          <select name="role" value={form.role} onChange={handleChange} style={{ width: "100%", marginBottom: 16 }}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" style={{ width: "100%", padding: 8, background: "#1976d2", color: "#fff", border: "none", borderRadius: 4 }}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;