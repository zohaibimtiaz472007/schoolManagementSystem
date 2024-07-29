import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/Config";
import icon from "./icon.png";

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
    <div className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <img
              src={icon}
              alt="Logo"
              className="h-16 w-16 md:h-20 md:w-20 object-contain"
            />
            <h1 className="text-[25px] md:text-4xl font-extrabold text-green-500 shadow-md">
              Admin Dashboard 
            </h1>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 text-black px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admission"
            className="bg-gray-800 bg-opacity-60 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            <h2 className="text-xl font-mono font-semibold text-green-400">
              Admission Center
            </h2>
          </Link>
          <Link
            to="/students"
            className="bg-gray-800 bg-opacity-60 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            <h2 className="text-xl font-mono font-semibold text-green-400">
              Student List
            </h2>
          </Link>
          <Link
            to="/fee"
            className="bg-gray-800 bg-opacity-60 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            <h2 className="text-xl font-mono font-semibold text-green-400">
              Fee Management <span className="text-[12px]">(Beta)</span>
            </h2>
          </Link>
          <Link
            to="/fees"
            className="bg-gray-800 bg-opacity-60 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            <h2 className="text-xl font-mono font-semibold text-green-400">
              Fee List
            </h2>
          </Link>
          <Link
            to="/results"
            className="bg-gray-800 bg-opacity-60 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            <h2 className="text-xl font-mono font-semibold text-green-400">
              Result Management
            </h2>
          </Link>
          <Link
            to="/results-list"
            className="bg-gray-800 bg-opacity-60 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            <h2 className="text-xl font-mono font-semibold text-green-400">
              Result List
            </h2>
          </Link>
          <div className="text-xl font-bold  " >version 1.0</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
