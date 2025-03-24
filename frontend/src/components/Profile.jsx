import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((state) => state.user);

  return (
    user && (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white p-10">
        <div className="bg-gray-800 shadow-2xl rounded-3xl p-12 w-full max-w-4xl transform transition duration-300 hover:scale-105">
          {/* Profile Picture */}
          <div className="flex flex-col items-center text-center">
            <img
              src={user.photourl}
              alt="Profile"
              className="w-48 h-48 rounded-full border-4 border-blue-500 shadow-2xl hover:shadow-blue-400 transition duration-300"
            />
            <h2 className="mt-6 text-5xl font-extrabold text-blue-400">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-300 text-xl mt-2">@{user.username}</p>
          </div>

          {/* User Details */}
          <div className="mt-8 space-y-6 text-xl text-gray-300 border-t border-gray-600 pt-8">
            <p><span className="font-semibold text-white">Email:</span> {user.email}</p>
            <p><span className="font-semibold text-white">Bio:</span> {user.bio || "No bio added yet."}</p>
          </div>

          {/* Edit Profile Button */}
          <div className="mt-10 flex justify-center">
            <EditProfile user={user} />
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;