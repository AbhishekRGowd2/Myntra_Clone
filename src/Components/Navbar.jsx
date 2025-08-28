import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, ShoppingCart } from "lucide-react";
import { logoutUser } from "../features/auth/authSlice"; // updated import

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="font-bold text-xl text-pink-600">Myntra Clone</div>

      <div className="flex items-center space-x-4">
        <img src="/MyntraLogo.png" alt="Logo" className="h-6 w-6" />

        <Link to={user ? "/cart" : "/login"} className="relative">
          <ShoppingCart className="w-6 h-6 hover:text-pink-600" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Link>
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center bg-pink-600 text-white px-3 py-1 rounded space-x-1 focus:outline-none"
            >
              <User className="w-5 h-5" />
              <span>{user.displayName || "User"}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 bg-pink-600 text-white  hover:bg-white hover:text-pink-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 border border-pink-600 text-pink-600 rounded hover:bg-pink-50 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
