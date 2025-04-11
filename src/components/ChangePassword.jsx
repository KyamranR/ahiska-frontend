import { useState } from "react";
import AhiskaApi from "../api/AhiskaApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ChangePassword = () => {
  const { currentUser } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AhiskaApi.changePassword(currentUser.id, newPassword);
      alert("Password changed successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Password change failed", err);
      alert("Failed to change password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
