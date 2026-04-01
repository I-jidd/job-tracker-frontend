import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getApplications,
  createApplication,
  updateStatus,
  deleteApplication,
} from "../services/applicationService";

export default function Application() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [form, setForm] = useState({
    jobTitle: "",
    company: "",
    jobUrl: "",
    appliedDate: "",
  });

  // Fetch applications on load
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const newApp = await createApplication(form);
      (setApplications([newApp, ...applications]), setShowModal(false));
      setForm({ jobTitle: "", company: "", jobUrl: "", appliedDate: "" });
    } catch (err) {
      console.error("Failed to create application", err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await updateStatus(id, status);
      setApplications(
        applications.map((app) => (app.id === id ? updated : app)),
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;
    try {
      await deleteApplication(id);
      setApplications(applications.filter((app) => app.id !== id));
    } catch (err) {
      console.error("Failed to delete application", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  //Filter and search logic
  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === "ALL" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    APPLIED: "bg-blue-100 text-blue-700",
    INTERVIEW: "bg-yellow-100 text-yellow-700",
    REJECTED: "bg-red-100 text-red-700",
    ACCEPTED: "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">Job Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              My Applications
            </h2>
            <p className="text-gray-500 text-sm">
              {applications.length} total applications
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            + Add Application
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by company or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Status</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="REJECTED">Rejected</option>
            <option value="ACCEPTED">Accepted</option>
          </select>
        </div>

        {/* Applications Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading applications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No applications found. Add your first one!
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">
                    Job Title
                  </th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">
                    Company
                  </th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">
                    Date Applied
                  </th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-gray-600 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {app.jobUrl ? (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {app.jobTitle}
                        </a>
                      ) : (
                        app.jobTitle
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{app.company}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {app.appliedDate}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value)
                        }
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[app.status]}`}
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="ACCEPTED">Accepted</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Application Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Add Application
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={form.jobTitle}
                  onChange={(e) =>
                    setForm({ ...form, jobTitle: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Google"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job URL (optional)
                </label>
                <input
                  type="url"
                  value={form.jobUrl}
                  onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Applied
                </label>
                <input
                  type="date"
                  value={form.appliedDate}
                  onChange={(e) =>
                    setForm({ ...form, appliedDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Add Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
