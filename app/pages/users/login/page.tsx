"use client";
import { useState } from "react";
import Layout from "@/app/layouts/Layout";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginLoading,setLoginloading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginloading(true);
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    setLoginloading(false);

    if (response.ok) {
      const data = await response.json();
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.data);
      }

      toast.success(data.message);
      window.location.href = "/pages/events";
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Login failed. Please try again.");
      toast.error(errorData.message || "Login failed. Please try again.");
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </label>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
         {loginLoading ? "Loading...":" Login"}
        </button>
      </form>
      <ToastContainer />
    </Layout>
  );
};

export default Login;
