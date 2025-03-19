import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AhiskaApi from "../api/AhiskaApi";
import { useNavigate } from "react-router-dom";

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

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const updatedUser = await AhiskaApi.updateUser(currentUser.id, formData);
      console.log("Updated User", updatedUser);

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
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      {/* Profile Picture */}
      <img
        src={formData.profilePic || "/default-profile.png"}
        alt="Profile"
        className="w-32 h-32 rounded-full mx-auto mb-4"
      />

      {/* Edit Mode */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="profilePic"
            value={formData.profilePic}
            onChange={handleChange}
            placeholder="Profile Picture URL"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Save Changes
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="w-full bg-gray-300 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="text-lg">
            {currentUser.firstName} {currentUser.lastName}
          </p>
          <p className="text-gray-600">{currentUser.bio}</p>

          <button
            onClick={() => setIsEditing(true)}
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
