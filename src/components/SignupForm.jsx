import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AhiskaApi from "../api/AhiskaApi.jsx";

const SignupForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState(null);

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const token = await AhiskaApi.register(formData);
      const decoded = AhiskaApi.decodeToken(token);
      const userId = decoded?.userId || decoded?.id;
      const { user } = await AhiskaApi.getCurrentUser(userId);

      login(user, token);
      navigate("/");
    } catch (err) {
      setError(err.error || "Signup failed.");
    }
  }

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <label className="block font-medium">First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
            <label className="block font-medium">Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>
          <div className="mt-2">
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>
          <div className="mt-2">
            <label className="block font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>
          <button className="w-full mt-4 bg-green-500 text-white p-2 rounded">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
