import axios from "axios";
import PropTypes from "prop-types";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedslice";
import { useState } from "react";

const EditUserCard = ({ user }) => {
  const { _id, firstName, lastName, photourl, age, gender, about } = user;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(null);

  const handleSendRequest = async (status, userId) => {
    setLoading(true);
    setActionType(status);
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Error sending request:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center">
        <div className="relative w-32 h-32 mx-auto -mt-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src={photourl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-white">
          {firstName} {lastName}
        </h2>
        {(age || gender) && (
          <p className="text-indigo-100">
            {age && `${age} years old`}
            {age && gender && " • "}
            {gender && `${gender.charAt(0).toUpperCase() + gender.slice(1)}`}
          </p>
        )}
      </div>

      {/* Profile Details */}
      <div className="p-6">
        {about && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              About
            </h3>
            <p className="mt-1 text-gray-700">{about}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => handleSendRequest("ignored", _id)}
            disabled={loading}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              loading && actionType === "ignored"
                ? "bg-gray-300 text-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {loading && actionType === "ignored" ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Ignore"
            )}
          </button>
          <button
            onClick={() => handleSendRequest("interested", _id)}
            disabled={loading}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-white transition-colors ${
              loading && actionType === "interested"
                ? "bg-indigo-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading && actionType === "interested" ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Interested"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

EditUserCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    photourl: PropTypes.string,
    age: PropTypes.number,
    gender: PropTypes.string,
    about: PropTypes.string,
  }).isRequired,
};

export default EditUserCard;