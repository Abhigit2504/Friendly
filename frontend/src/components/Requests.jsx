import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useCallback, useState } from "react";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const reviewRequest = async (status, _id) => {
    setActionLoading(_id);
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(null);
    }
  };

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-orange-500">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white font-medium">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-orange-500">
        <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl text-center max-w-md mx-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            No Connection Requests
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have any pending connection requests at the moment.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-orange-500 mx-auto rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Connection Requests
          </h1>
          <p className="text-white text-opacity-80">
            You have {requests.length} pending request{requests.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="space-y-6">
          {requests.map((request) => {
            const { _id, firstName, lastName, photourl, age, gender, about } =
              request.fromUserId;
            return (
              <div
                key={_id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <div className="p-6 sm:flex sm:items-center sm:space-x-6">
                  {/* Profile Image */}
                  <div className="flex-shrink-0 mb-4 sm:mb-0">
                    <img
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-pink-200"
                      src={photourl || "https://avatar.iran.liara.run/public?username=" + firstName}
                      alt={`${firstName} ${lastName}`}
                    />
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-bold text-gray-800">
                      {firstName} {lastName}
                    </h2>
                    {(age || gender) && (
                      <p className="text-sm text-gray-500 mt-1">
                        {[age && `${age} years`, gender].filter(Boolean).join(', ')}
                      </p>
                    )}
                    {about && (
                      <p className="text-gray-600 mt-2 text-sm sm:text-base">
                        "{about}"
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                    <button
                      onClick={() => reviewRequest("accepted", request._id)}
                      disabled={actionLoading === request._id}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        actionLoading === request._id
                          ? 'bg-green-400 cursor-not-allowed'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      } flex items-center justify-center`}
                    >
                      {actionLoading === request._id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Accepting...
                        </>
                      ) : (
                        'Accept'
                      )}
                    </button>
                    <button
                      onClick={() => reviewRequest("rejected", request._id)}
                      disabled={actionLoading === request._id}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        actionLoading === request._id
                          ? 'bg-red-400 cursor-not-allowed'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      } flex items-center justify-center`}
                    >
                      {actionLoading === request._id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Rejecting...
                        </>
                      ) : (
                        'Reject'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Requests;