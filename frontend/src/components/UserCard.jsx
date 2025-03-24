import axios from "axios";
import PropTypes from "prop-types";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedslice";
import { useState } from "react";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photourl, age, gender, about } = user;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendRequest = async (status, userId) => {
    setLoading(true);
    setError("");
    try {
      await axios.post(`${BASE_URL}/request/send/${status}/${userId}`, {}, { withCredentials: true });
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      setError("Something went wrong. Please try again!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-sm transition-transform transform hover:scale-105">
      <figure className="relative w-full h-56">
        <img src={photourl} className="w-full h-full object-cover" alt={`${firstName} ${lastName}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
      </figure>
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-gray-800">{firstName} {lastName}</h2>
        {age && gender && <p className="text-gray-500 text-sm">{age}, {gender}</p>}
        <p className="text-gray-700 mt-2 text-sm truncate">{about}</p>

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

        <div className="flex justify-between mt-4">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all text-sm w-1/2 mr-2"
            onClick={() => handleSendRequest("ignored", _id)}
            disabled={loading}
          >
            {loading ? "Processing..." : "Ignore"}
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all text-sm w-1/2"
            onClick={() => handleSendRequest("interested", _id)}
            disabled={loading}
          >
            {loading ? "Processing..." : "Interested"}
          </button>
        </div>
      </div>
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserCard;