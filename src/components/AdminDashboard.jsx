import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/Config"; // Adjust the import path as needed

const AdminDashboard = () => {
  const navigate = useNavigate();

  //* Logout Function
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 to-blue-500 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-white shadow-md">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admission"
            className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg backdrop-blur-md hover:shadow-xl transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-white">Manage Admissions</h2>
          </Link>
          <Link
            to="/students"
            className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg backdrop-blur-md hover:shadow-xl transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-white">Student List</h2>
          </Link>
          <Link
            to="/fee"
            className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg backdrop-blur-md hover:shadow-xl transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-white">Manage Fees</h2>
          </Link>
          <Link
            to="/fees"
            className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg backdrop-blur-md hover:shadow-xl transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-white">Fee List</h2>
          </Link>
          <Link
            to="/results"
            className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg backdrop-blur-md hover:shadow-xl transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-white">Manage Results</h2>
          </Link>
          <Link
            to="/results-list"
            className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg backdrop-blur-md hover:shadow-xl transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-white">Result List</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
