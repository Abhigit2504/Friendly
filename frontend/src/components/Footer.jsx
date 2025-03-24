import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-8">
      <footer className="max-w-6xl mx-auto flex flex-col items-center text-center px-6">
        {/* Logo / Branding */}
        <h2 className="text-2xl font-bold text-white mb-3">👥FRIENDLY</h2>
        
        {/* Social Media Links */}
        <div className="flex space-x-4 mb-4">
          <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-blue-500 transition">
            <FaFacebookF />
          </a>
          <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-sky-400 transition">
            <FaTwitter />
          </a>
          <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-blue-700 transition">
            <FaLinkedinIn />
          </a>
          <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition">
            <FaGithub />
          </a>
        </div>

        {/* Copyright Text */}
        <p className="text-sm">
          © {new Date().getFullYear()} DevBook Company Ltd. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Footer;
