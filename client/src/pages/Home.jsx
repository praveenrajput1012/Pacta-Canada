import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/api/projects");
        setProjects(res.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Latest Projects</h1>
      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project._id} className="bg-white p-6 rounded shadow">
            <Link to={`/project/${project._id}`} className="text-xl font-bold text-blue-600">
              {project.title}
            </Link>
            <p className="mt-2">{project.description}</p>
            <div className="mt-2 text-gray-600">
              By{" "}
              <Link to={`/profile/${project.user._id}`} className="text-blue-600">
                {project.user.username}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
