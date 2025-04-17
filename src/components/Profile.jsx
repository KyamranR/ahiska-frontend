import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AhiskaApi from "../api/AhiskaApi";
import { useNavigate } from "react-router-dom";
import defaultProfilePic from "../assets/react.svg";

const Profile = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    profilePic: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        bio: currentUser.bio || "",
        profilePic: currentUser.profilePic || "",
      });
    }
  }, [currentUser]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await AhiskaApi.deleteUser(currentUser.id);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setCurrentUser(null);

      AhiskaApi.token = null;
      navigate("/");
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const updatedUser = await AhiskaApi.updateUser(currentUser.id, formData);

      setCurrentUser((prevUser) => ({
        ...prevUser,
        ...updatedUser.user,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-10">
      <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-800 shadow-lg rounded-xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>

        {/* Profile Picture */}
        <img
          src={formData.profilePic || defaultProfilePic}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
        />

        {/* Edit Mode */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Bio"
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="profilePic"
              value={formData.profilePic}
              onChange={handleChange}
              placeholder="Profile Picture URL"
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mr-2 px-4"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-red-500 hover:bg-gray-600 text-white py-2 rounded-md px-4"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-xl font-semibold mb-1">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className="text-gray-400 mb-4">{currentUser.bio}</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                Edit Profile
              </button>

              <button
                onClick={() => navigate("/change-password")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
              >
                Change Password
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white py-2 rounded"
              >
                Delete Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
