import React, { useEffect, useState } from "react";
import API from "../api/axios";

const Profile = () => {
  const [form, setForm] = useState({ username: "", email: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user info on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    API.get("/api/users/me", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        setForm({
          username: res.data.username,
          email: res.data.email,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user profile", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token");

    try {
      await API.put("/api/users/me", form, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setMessage("Profile updated!");
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message || "Failed to update profile.";
      setMessage(msg);
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        Loading profile...
      </div>
    );

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2>Your Profile</h2>
      {message && (
        <div style={{ marginBottom: 12, color: "blue" }}>{message}</div>
      )}
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
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 16 }}
            type="email"
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 8,
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 4,
          }}
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
