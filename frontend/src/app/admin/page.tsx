/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";
import FullPageLoading from "@/components/FullPageLoading";

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    quizId: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError(""); // Clear error when user types
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.quizId || !formData.password) {
      setError("Both fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/admin/login", {
        quizID: formData.quizId.trim(),
        adminPassword: formData.password
      }, {
        withCredentials: true // Ensure cookies are sent
      });

      if (response.status === 200) {
        router.push("/admin/dashboard/entries");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError("Invalid credentials");
            break;
          case 403:
            setError("Access denied");
            break;
          case 500:
            setError("Server error. Please try again later.");
            break;
          default:
            setError("Login failed. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <FullPageLoading />;
  }

  return (
    <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-lg px-8 pt-8 pb-8 mb-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Admin Login
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="quizId">
                Quiz ID
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="quizId"
                type="text"
                value={formData.quizId}
                onChange={handleInputChange}
                placeholder="Enter Quiz ID"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter Password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;