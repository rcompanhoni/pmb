import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { DebounceInput } from "react-debounce-input";
import AuthModal from "../features/auth/components/AuthModal";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  useEffect(() => {
    // sync search input with query parameter on component mount
    const searchParams = new URLSearchParams(location.search);
    const initialSearch = searchParams.get("search") || "";
    setSearch(initialSearch);
  }, [location.search]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    setSearch(newSearch);

    // update the URL query parameter for search
    const searchParams = new URLSearchParams(location.search);
    if (newSearch.trim()) {
      searchParams.set("search", newSearch.trim());
    } else {
      searchParams.delete("search"); // remove the search param if empty
    }
    navigate(`/?${searchParams.toString()}`);
  };

  const clearSearch = () => {
    setSearch("");
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("search"); // ensure the search param is removed
    navigate(`/?${searchParams.toString()}`);
  };

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

          <div className="relative w-full md:w-64 lg:w-80">
            <DebounceInput
              minLength={2}
              debounceTimeout={300}
              placeholder="Search posts..."
              value={search}
              onChange={handleSearchChange}
              className="p-2 pr-8 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 text-gray-800 w-full"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onRequestClose={closeAuthModal} />
    </header>
  );
}
