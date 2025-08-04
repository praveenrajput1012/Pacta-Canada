import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentMsg, setCommentMsg] = useState("");
  const navigate = useNavigate();

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Fetch project details
  useEffect(() => {
    fetch(`https://pacta-canada-2.onrender.com/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Fetch comments
  useEffect(() => {
    fetch(`https://pacta-canada-2.onrender.com/api/comments/${id}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch(() => setComments([]));
  }, [id]);

  const [editingCommentId, setEditingCommentId] = useState(null);
const [editingCommentText, setEditingCommentText] = useState("");


  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentMsg("");
    const token = localStorage.getItem("token");
    if (!token) {
      setCommentMsg("You must be logged in to comment.");
      return;
    }
    try {
      const res = await fetch(`https://pacta-canada-2.onrender.com/api/comments/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ text: commentText }),
      });
      const data = await res.json();
      if (res.ok) {
        setCommentText("");
        setCommentMsg("Comment added!");
        // Refresh comments
        fetch(`https://pacta-canada-2.onrender.com/api/comments/${id}`)
          .then((res) => res.json())
          .then((data) => setComments(data));
      } else {
        setCommentMsg(data.message || "Failed to add comment.");
      }
    } catch (err) {
      setCommentMsg("Failed to add comment. Server error.");
    }
  };

  // Handle project deletion
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`https://pacta-canada-2.onrender.com/api/projects/${project._id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (res.ok) {
        alert("Project deleted!");
        navigate("/projects");
      } else {
        alert("Failed to delete project.");
      }
    } catch {
      alert("Server error.");
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Loading project...</div>;
  if (!project) return <div style={{ textAlign: "center", marginTop: 40 }}>Project not found.</div>;

  // Check if user is owner or admin
  const canEditOrDelete =
    user && (user._id === project.user?._id || user.role === "admin");

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>{project.title}</h2>
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

      {/* Edit and Delete Buttons */}
      {canEditOrDelete && (
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => navigate(`/projects/${project._id}/edit`)}
            style={{ marginRight: 8, padding: "6px 12px", background: "#ffa726", color: "#fff", border: "none", borderRadius: 4 }}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            style={{ padding: "6px 12px", background: "#e53935", color: "#fff", border: "none", borderRadius: 4 }}
          >
            Delete
          </button>
        </div>
      )}

      {/* Comments Section */}
      <div style={{ marginTop: 32 }}>
  <h3>Comments</h3>
  {comments.length === 0 && <div>No comments yet.</div>}
  <ul style={{ listStyle: "none", padding: 0 }}>
    {comments.map((comment) => {
      const canEditOrDeleteComment =
        user && (user._id === comment.user?._id || user.role === "admin");
      return (
        <li key={comment._id} style={{ borderBottom: "1px solid #eee", marginBottom: 8, paddingBottom: 8 }}>
          <strong>{comment.user?.username || "Anonymous"}:</strong>{" "}
          {editingCommentId === comment._id ? (
            <>
              <textarea
                value={editingCommentText}
                onChange={(e) => setEditingCommentText(e.target.value)}
                style={{ width: "100%", minHeight: 40 }}
              />
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  try {
                    const res = await fetch(`https://pacta-canada-2.onrender.com/api/comments/${comment._id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                      },
                      body: JSON.stringify({ text: editingCommentText }),
                    });
                    if (res.ok) {
                      setEditingCommentId(null);
                      // Refresh comments
                      fetch(`https://pacta-canada-2.onrender.com/api/comments/${id}`)
                        .then((res) => res.json())
                        .then((data) => setComments(data));
                    }
                  } catch {}
                }}
                style={{ marginRight: 8, padding: "4px 10px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 4 }}
              >
                Save
              </button>
              <button
                onClick={() => setEditingCommentId(null)}
                style={{ padding: "4px 10px", background: "#aaa", color: "#fff", border: "none", borderRadius: 4 }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {comment.text}
              <div style={{ fontSize: 12, color: "#888" }}>{new Date(comment.createdAt).toLocaleString()}</div>
              {canEditOrDeleteComment && (
                <div style={{ marginTop: 4 }}>
                  <button
                    onClick={() => {
                      setEditingCommentId(comment._id);
                      setEditingCommentText(comment.text);
                    }}
                    style={{ marginRight: 8, padding: "2px 8px", background: "#ffa726", color: "#fff", border: "none", borderRadius: 4, fontSize: 12 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm("Delete this comment?")) {
                        const token = localStorage.getItem("token");
                        try {
                          const res = await fetch(`https://pacta-canada-2.onrender.com/api/comments/${comment._id}`, {
                            method: "DELETE",
                            headers: { Authorization: "Bearer " + token },
                          });
                          if (res.ok) {
                            // Refresh comments
                            fetch(`https://pacta-canada-2.onrender.com/api/comments/${id}`)
                              .then((res) => res.json())
                              .then((data) => setComments(data));
                          }
                        } catch {}
                      }
                    }}
                    style={{ padding: "2px 8px", background: "#e53935", color: "#fff", border: "none", borderRadius: 4, fontSize: 12 }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </li>
      );
    })}
  </ul>
  {/* Add Comment Form */}
  <form onSubmit={handleCommentSubmit} style={{ marginTop: 16 }}>
    <textarea
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      placeholder="Add a comment..."
      required
      style={{ width: "100%", minHeight: 60, marginBottom: 8 }}
    />
    <button type="submit" style={{ padding: "8px 16px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 4 }}>
      Post Comment
    </button>
  </form>
  {commentMsg && <div style={{ marginTop: 8, color: "blue" }}>{commentMsg}</div>}
</div>



      <div style={{ marginTop: 24 }}>
        <Link to="/projects">← Back to Projects</Link>
      </div>
    </div>
  );
};

export default ProjectDetail;