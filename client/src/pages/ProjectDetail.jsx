import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentMsg, setCommentMsg] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const token = localStorage.getItem("token");

  // Fetch project
  useEffect(() => {
    API.get(`/api/projects/${id}`)
      .then((res) => {
        setProject(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Fetch comments
  const loadComments = () => {
    API.get(`/api/comments/${id}`)
      .then((res) => setComments(res.data))
      .catch(() => setComments([]));
  };

  useEffect(() => {
    loadComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentMsg("");
    if (!token) {
      setCommentMsg("You must be logged in to comment.");
      return;
    }

    try {
      await API.post(
        `/api/comments/${id}`,
        { text: commentText },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setCommentText("");
      setCommentMsg("Comment added!");
      loadComments();
    } catch (err) {
      setCommentMsg("Failed to add comment. Server error.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await API.delete(`/api/projects/${project._id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      alert("Project deleted!");
      navigate("/projects");
    } catch {
      alert("Failed to delete project.");
    }
  };

  const handleCommentEdit = async (commentId) => {
    try {
      await API.put(
        `/api/comments/${commentId}`,
        { text: editingCommentText },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setEditingCommentId(null);
      loadComments();
    } catch {
      alert("Failed to update comment.");
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await API.delete(`/api/comments/${commentId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      loadComments();
    } catch {
      alert("Failed to delete comment.");
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Loading project...</div>;
  if (!project) return <div style={{ textAlign: "center", marginTop: 40 }}>Project not found.</div>;

  const canEditOrDelete = user && (user._id === project.user?._id || user.role === "admin");

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

      <div style={{ marginTop: 32 }}>
        <h3>Comments</h3>
        {comments.length === 0 && <div>No comments yet.</div>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {comments.map((comment) => {
            const canEditComment = user && (user._id === comment.user?._id || user.role === "admin");
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
                      onClick={() => handleCommentEdit(comment._id)}
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
                    {canEditComment && (
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
                          onClick={() => handleCommentDelete(comment._id)}
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
