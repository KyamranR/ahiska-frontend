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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-8">
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
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md px-3"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
