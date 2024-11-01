import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">
          <Link to="/">Mini Blog</Link>
        </h1>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          <span className="hover:underline cursor-pointer">Login</span>

          <input
            type="text"
            placeholder="Search posts..."
            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 text-gray-800 w-full md:w-64 lg:w-80"
          />
        </div>
      </div>
    </header>
  );
}
