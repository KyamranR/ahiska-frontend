import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AhiskaApi from "../api/AhiskaApi";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const res = await AhiskaApi.login(formData);
      login(res.user, res.token);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err?.error?.message || err?.message || "Login failed.";
      setError(errorMessage);
    }
  }

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl animate-fade-in text-white">
        <h2 className="text-3xl font-bold text-center text-indigo-300 mb-6">
          Login
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-indigo-200"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mt-1 rounded-lg bg-white/20 text-white border border-indigo-500 placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <div className="mt-2">
            <label
              htmlFor="password"
              className="block text-lg font-medium text-indigo-200"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 mt-1 rounded-lg bg-white/20 text-white border border-indigo-500 placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 transition-colors duration-300 p-3 rounded-lg text-white font-semibold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
