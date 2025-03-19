import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-lg font-bold">
          Community Connect
        </NavLink>

        <div className="space-x-4">
          <NavLink to="/events" className="hover:underline">
            Events
          </NavLink>
          <NavLink to="/about" className="hover:underline">
            About
          </NavLink>
          <NavLink to="/contact" className="hover:underline">
            Contact Us
          </NavLink>
          <NavLink to="/q_and_a" className="hover:underline">
            Q and A
          </NavLink>
          {currentUser && (
            <NavLink to="/profile" className="hover:underline">
              Profile
            </NavLink>
          )}

          {currentUser?.role === "admin" && (
            <NavLink to="/admin">Admin Panel</NavLink>
          )}
        </div>

        <div>
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <p className="text-lg">
                Welcome, {currentUser?.firstName || "Guest"}!
              </p>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <Link
                to="/login"
                className="mr-4 bg-white text-blue-600 px-4 py-2 rounded"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-4 py-2 rounded"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
