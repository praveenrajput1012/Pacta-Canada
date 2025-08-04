import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const CreateProject = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    links: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in to create a project.");
      return;
    }

    try {
      const res = await API.post(
        "/api/projects",
        {
          title: form.title,
          description: form.description,
          links: form.links.split(",").map((link) => link.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Project created!");
      setTimeout(() => {
        navigate("/projects"); // Redirect to project list
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Project creation failed. Server error.");
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2>Create Project</h2>
      {message && <div style={{ marginBottom: 12, color: "blue" }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </div>
        <div>
          <label>Links (comma separated):</label>
          <input
            name="links"
            value={form.links}
            onChange={handleChange}
            placeholder="https://github.com, https://demo.com"
            style={{ width: "100%", marginBottom: 16 }}
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
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
