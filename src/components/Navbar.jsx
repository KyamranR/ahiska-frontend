import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900/90 backdrop-blur sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <NavLink to="/" className="text-xl font-bold text-white tracking-wide">
          Ahiska Community
        </NavLink>

        <div className="md:hidden text-white" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        <div
          className={`${
            isOpen ? "flex" : "hidden"
          } absolute md:static top-16 left-0 w-full md:w-auto bg-gray-900 md:bg-transparent md:flex items-center flex-col md:flex-row gap-4 md:gap-6 px-4 py-4 md:py-0 transition-all duration-300 whitespace-nowrap`}
        >
          <NavLink to="/events" className="nav-link">
            Events
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact Us
          </NavLink>
          <NavLink to="/q_and_a" className="nav-link">
            Q and A
          </NavLink>
          {currentUser && (
            <NavLink to="/profile" className="nav-link">
              Profile
            </NavLink>
          )}

          {currentUser?.role === "admin" && (
            <NavLink to="/admin" className="nav-link">
              Admin Panel
            </NavLink>
          )}

          {!currentUser ? (
            <div className="flex flex-col md:hidden gap-2">
              <Link
                to="/login"
                className="bg-white text-gray-900 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm md:hidden"
            >
              Logout
            </button>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4 text-white">
          {currentUser ? (
            <>
              <p className="text-sm md:text-base">
                Welcome, {currentUser?.firstName || "Guest"}!
              </p>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-gray-900 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
