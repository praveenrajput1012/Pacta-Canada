import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://pacta-canada-2.onrender.com/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Loading projects...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>All Projects</h2>
      <Link to="/projects/create" style={{ float: "right", marginBottom: 16 }}>+ Create Project</Link>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {projects.length === 0 && <li>No projects found.</li>}
        {projects.map((project) => (
          <li key={project._id} style={{ border: "1px solid #eee", borderRadius: 8, marginBottom: 16, padding: 16 }}>
            <h3>
              <Link to={`/projects/${project._id}`}>{project.title}</Link>
            </h3>
            <p>{project.description}</p>
            <div>
              <strong>By:</strong> {project.user?.username || "Unknown"}
            </div>
            {project.links && project.links.length > 0 && (
              <div>
                <strong>Links:</strong>{" "}
                {project.links.map((link, idx) => (
                  <a key={idx} href={link} target="_blank" rel="noopener noreferrer" style={{ marginRight: 8 }}>
                    {link}
                  </a>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;