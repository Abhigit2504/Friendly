import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX, FiUser, FiLogOut, FiHome, FiUsers, FiBell } from "react-icons/fi";
import { debounce } from "lodash";

const NavBar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const { data } = await axios.get(
          `${BASE_URL}/search-users?query=${encodeURIComponent(query)}`,
          { withCredentials: true }
        );
        setSearchResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowResults(query.length > 0);
    debouncedSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-md sticky top-0 z-50">
      <div className="navbar max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-white">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold flex items-center">
        👥FRIENDLY
        </Link>

        {/* Search Bar */}
        <div className="relative w-full max-w-md mx-4" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for users..."
              className="w-full pl-10 pr-8 py-2 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery && setShowResults(true)}
            />
            <FiSearch className="absolute left-3 top-3 text-gray-500" />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                <FiX />
              </button>
            )}
          </div>

          {showResults && (
            <div className="absolute left-0 w-full bg-white text-black shadow-lg rounded-md mt-2 max-h-96 overflow-auto z-50">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((result) => (
                    <li
                      key={result._id}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                      onClick={() => {
                        navigate(`/profile/${result._id}`);
                        clearSearch();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                          <img
                            src={result.photourl || "/default-avatar.png"}
                            alt={`${result.firstName} ${result.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">
                            {result.firstName} {result.lastName}
                          </p>
                          {result.age && (
                            <p className="text-sm text-gray-500">
                              {result.age} years
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No users found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        {user && (
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden md:flex items-center gap-1 hover:text-blue-300 transition"
            >
              <FiHome className="text-lg" />
              <span>Home</span>
            </Link>
            <Link
              to="/connections"
              className="hidden md:flex items-center gap-1 hover:text-blue-300 transition"
            >
              <FiUsers className="text-lg" />
              <span>Connections</span>
            </Link>
            <Link
              to="/requests"
              className="hidden md:flex items-center gap-1 hover:text-blue-300 transition"
            >
              <FiBell className="text-lg" />
              <span>Requests</span>
            </Link>

            {/* User Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <img
                    src={user.photourl || "/default-avatar.png"}
                    alt="UserPhotoUrl"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-gray-800 text-white rounded-md z-50 mt-3 w-52 p-2 shadow-lg"
              >
                <li>
                  <Link to="/profile" className="flex items-center gap-2">
                    <FiUser />
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link to="/" className="flex items-center gap-2">
                    <FiHome />
                    Feed
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="flex items-center gap-2">
                    <FiUsers />
                    Connections
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className="flex items-center gap-2">
                    <FiBell />
                    Requests
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left hover:bg-red-600 p-2 rounded"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;