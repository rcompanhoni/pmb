import { useState, useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchPosts() {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

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
  );
}
