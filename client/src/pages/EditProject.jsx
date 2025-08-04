import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

const EditProject = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", description: "", links: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch the current project data to pre-fill the form
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await API.get(`/api/projects/${id}`);
        const data = res.data;
        setForm({
          title: data.title,
          description: data.description,
          links: data.links ? data.links.join(", ") : "",
        });
      } catch (error) {
        setMessage("Failed to fetch project.");
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Unauthorized. Please log in.");
      return;
    }

    try {
      await API.put(
        `/api/projects/${id}`,
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

      setMessage("Project updated!");
      setTimeout(() => {
        navigate(`/projects/${id}`);
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update project.");
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
      <h2>Edit Project</h2>
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
          Update Project
        </button>
      </form>
    </div>
  );
};

export default EditProject;
