import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProject = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", description: "", links: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch the current project data to pre-fill the form
  useEffect(() => {
    fetch(`https://pacta-canada-2.onrender.com/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          title: data.title,
          description: data.description,
          links: data.links ? data.links.join(", ") : "",
        });
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`https://pacta-canada-2.onrender.com/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          links: form.links.split(",").map((link) => link.trim()),
        }),
      });
      if (res.ok) {
        setMessage("Project updated!");
        setTimeout(() => {
          navigate(`/projects/${id}`);
        }, 1000);
      } else {
        setMessage("Failed to update project.");
      }
    } catch {
      setMessage("Server error.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
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
        <button type="submit" style={{ width: "100%", padding: 8, background: "#1976d2", color: "#fff", border: "none", borderRadius: 4 }}>
          Update Project
        </button>
      </form>
    </div>
  );
};

export default EditProject;