import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <Link to="/" className="font-bold text-xl text-blue-600">
        DevConnect
      </Link>
      <div className="space-x-4">
      
        {user ? (
          <>
            <Link to="/create" className="text-gray-700 hover:text-blue-600">
              Create Project
            </Link>
            <Link
              to={`/profile/${user.id}`}
              className="text-gray-700 hover:text-blue-600"
            >
              {user.username}
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-blue-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link to="/signup" className="text-gray-700 hover:text-blue-600">
              Signup
            </Link>
            
          </>
        )}
      </div>
      
    </nav>
  );
}