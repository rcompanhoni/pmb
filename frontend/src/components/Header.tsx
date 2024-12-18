import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import SearchPosts from "../features/posts/components/SearchPosts";

export default function Header() {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">
          <Link to="/">Mini Blog</Link>
        </h1>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          {user ? (
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-2 md:px-4 py-2 rounded-md"
            >
              <FiLogOut className="text-xl" />
              <span className="hidden md:inline">Logout</span>
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 px-2 md:px-4 py-2 rounded-md"
            >
              <FiLogIn className="text-xl" />
              <span className="hidden md:inline">Sign In / Sign Up</span>
            </button>
          )}

          <SearchPosts />
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onRequestClose={closeAuthModal} />
    </header>
  );
}
