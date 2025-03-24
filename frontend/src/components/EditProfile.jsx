import { useState } from "react";
import PropTypes from "prop-types";
import EditUserCard from "./EditUserCard";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    age: user.age || "",
    gender: user.gender || "",
    about: user.about || "",
    photourl: user.photourl || ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateInputs = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First Name and Last Name are required.");
      return false;
    }
    if (formData.age && (isNaN(formData.age) || formData.age <= 0)) {
      setError("Please enter a valid age.");
      return false;
    }
    return true;
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setError("");
    setLoading(true);
    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        formData,
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(err.response?.data || "An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Edit Your Profile</h1>
          <p className="mt-2 text-lg text-gray-600">Update your personal information below</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-1/2 bg-white shadow-md rounded-lg p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-600 rounded-lg">
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={saveProfile} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">First Name *</label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-2 w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Last Name *</label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-2 w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Profile Photo URL</label>
                <input
                  name="photourl"
                  type="url"
                  value={formData.photourl}
                  onChange={handleChange}
                  className="mt-2 w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Age</label>
                  <input
                    name="age"
                    type="number"
                    min="1"
                    value={formData.age}
                    onChange={handleChange}
                    className="mt-2 w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-2 w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">About</label>
                <textarea
                  name="about"
                  rows={3}
                  value={formData.about}
                  onChange={handleChange}
                  className="mt-2 w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-white font-semibold rounded-md transition ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
          <div className="w-full lg:w-1/2">
            <EditUserCard user={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};

EditProfile.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    age: PropTypes.number,
    gender: PropTypes.string,
    about: PropTypes.string,
    photourl: PropTypes.string,
  }).isRequired,
};

export default EditProfile;