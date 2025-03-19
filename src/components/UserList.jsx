import React, { useState, useEffect } from "react";
import AhiskaApi from "../api/AhiskaApi";

const UserList = ({ users, refreshUsers }) => {
  const [roleUpdates, setRoleUpdates] = useState({});

  useEffect(() => {
    const initialRoleUpdates = {};
    users.forEach((user) => {
      initialRoleUpdates[user.id] = user.role;
    });
    setRoleUpdates(initialRoleUpdates);
  }, [users]);

  const handleDeleteUser = async (userId) => {
    try {
      await AhiskaApi.deleteUserAdmin(userId);
      refreshUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateRole = async (userId) => {
    try {
      await AhiskaApi.updatedUserRole(userId, roleUpdates[userId]);
      refreshUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleRoleChange = (userId, role) => {
    setRoleUpdates({ ...roleUpdates, [userId]: role });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Users</h2>
      <ul className="divide-y divide-gray-200">
        {users.map((user) => (
          <li key={user.id} className="py-4 flex items-center justify-between">
            <div className="flex-grow">
              <p className="font-medium text-gray-800">
                {user.firstName} {user.lastName} ({user.email})
              </p>
              <p className="text-sm text-gray-600">Role: {user.role}</p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={roleUpdates[user.id] || user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={() => handleUpdateRole(user.id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
              >
                Update Role
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
