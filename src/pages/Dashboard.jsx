import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome, {user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/applications"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              My Applications
            </h3>
            <p className="text-gray-500 text-sm">
              Track and manage your job applications
            </p>
            <span className="text-blue-600 text-sm font-medium mt-4 block">
              View all →
            </span>
          </Link>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              AI Resume Analysis
            </h3>
            <p className="text-gray-500 text-sm">
              Coming in Phase 5 — analyze your resume against job descriptions
            </p>
            <span className="text-gray-400 text-sm font-medium mt-4 block">
              Coming soon...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
