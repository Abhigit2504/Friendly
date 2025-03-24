import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedslice";
import { useEffect, useCallback, useState } from "react";
import UserCard from "./UserCard";
import { motion } from "framer-motion";
import { FiRefreshCw, FiAlertCircle, FiUsers } from "react-icons/fi";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const getFeed = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res?.data?.data));
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch user data. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => {
    getFeed();
  }, [getFeed]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1.5 }} 
          className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full mb-6" 
        />
        <h1 className="text-xl font-semibold text-gray-800">Loading amazing connections...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6">
        <FiAlertCircle className="text-red-500 text-6xl mb-4" />
        <h1 className="text-xl font-bold text-red-600">Oops! Something went wrong</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={getFeed} 
          className="px-6 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (feed.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <FiUsers className="text-gray-400 text-6xl mb-4" />
        <h1 className="text-xl font-bold text-gray-700">No New Connections</h1>
        <p className="text-gray-500 mb-4">Check back later for more profiles.</p>
        <button 
          onClick={getFeed} 
          className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">People You May Know</h2>
            <p className="text-gray-500 mt-1">{feed.length} suggestions</p>
          </div>
          <button 
            onClick={getFeed}
            disabled={refreshing}
            className={`px-5 py-2 rounded-md shadow transition flex items-center ${
              refreshing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {feed.map((user, index) => (
            <motion.div 
              key={user._id || index}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full"
            >
              <div className="flex-1 min-h-0 overflow-hidden">
                <UserCard user={user} />
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="flex justify-between">
                  {/* <button className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {/* <button className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button> */}
                  {/* <button className="p-2 rounded-full bg-green-50 text-green-500 hover:bg-green-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button> */} 
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;