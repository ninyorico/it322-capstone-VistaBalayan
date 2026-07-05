import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import TourismHome from "./pages/public/TourismHome";
import OfficerLayout from "./layouts/OfficerLayout";
import StaffLayout from "./layouts/StaffLayout";
import NotFound from "./pages/NotFound";

// Officer Pages (Placeholder components - you can replace these later)
function OfficerDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">Officer Dashboard</h2>
      <p className="text-gray-600 mt-2">Welcome to the Tourism Officer Dashboard</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700">Total Establishments</h3>
          <p className="text-3xl font-bold text-[#1293B8] mt-2">42</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700">Pending Reports</h3>
          <p className="text-3xl font-bold text-[#F59E0B] mt-2">7</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700">Total Visitors</h3>
          <p className="text-3xl font-bold text-[#22C55E] mt-2">1,284</p>
        </div>
      </div>
    </div>
  );
}

function Establishments() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">Establishments & Users</h2>
      <p className="text-gray-600 mt-2">Manage tourist establishments and user accounts</p>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-4">
        <p className="text-gray-500">Establishment management coming soon...</p>
      </div>
    </div>
  );
}

function VisitorMonitoring() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">Visitor Monitoring</h2>
      <p className="text-gray-600 mt-2">Monitor and track visitor arrivals</p>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-4">
        <p className="text-gray-500">Visitor monitoring dashboard coming soon...</p>
      </div>
    </div>
  );
}

function AccommodationMonitoring() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">Accommodation Monitoring</h2>
      <p className="text-gray-600 mt-2">Monitor room occupancy and accommodation reports</p>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-4">
        <p className="text-gray-500">Accommodation monitoring coming soon...</p>
      </div>
    </div>
  );
}

function OfficerReports() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
      <p className="text-gray-600 mt-2">View and manage tourism reports</p>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-4">
        <p className="text-gray-500">Reports management coming soon...</p>
      </div>
    </div>
  );
}

function OfficerAnalytics() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
      <p className="text-gray-600 mt-2">View tourism analytics and trends</p>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-4">
        <p className="text-gray-500">Analytics dashboard coming soon...</p>
      </div>
    </div>
  );
}

function OfficerAIInsights() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
      <p className="text-gray-600 mt-2">AI-powered tourism insights and recommendations</p>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-4">
        <p className="text-gray-500">AI insights coming soon...</p>
      </div>
    </div>
  );
}

// Staff Pages
function StaffDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">Staff Dashboard</h2>
      <p className="text-gray-600 mt-2">Welcome to the Establishment Staff Dashboard</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700">Reports Submitted</h3>
          <p className="text-3xl font-bold text-[#1293B8] mt-2">24</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700">Pending Approval</h3>
          <p className="text-3xl font-bold text-[#F59E0B] mt-2">3</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700">Approved</h3>
          <p className="text-3xl font-bold text-[#22C55E] mt-2">21</p>
        </div>
      </div>
    </div>
  );
}

function SubmitVisitorReport() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">Submit Visitor Report</h2>
      <p className="text-gray-600 mt-2">Submit daily visitor arrival reports</p>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-4">
        <p className="text-gray-500">Visitor report form coming soon...</p>
      </div>
    </div>
  );
}

function SubmitAccommodationReport() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">Submit Accommodation Report</h2>
      <p className="text-gray-600 mt-2">Submit room occupancy and accommodation reports</p>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-4">
        <p className="text-gray-500">Accommodation report form coming soon...</p>
      </div>
    </div>
  );
}

function SubmissionHistory() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">Submission History</h2>
      <p className="text-gray-600 mt-2">View your past report submissions</p>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-4">
        <p className="text-gray-500">Submission history coming soon...</p>
      </div>
    </div>
  );
}

function StaffAnalytics() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
      <p className="text-gray-600 mt-2">View your establishment's analytics</p>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-4">
        <p className="text-gray-500">Analytics dashboard coming soon...</p>
      </div>
    </div>
  );
}

function StaffAIInsights() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
      <p className="text-gray-600 mt-2">AI-powered insights for your establishment</p>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-4">
        <p className="text-gray-500">AI insights coming soon...</p>
      </div>
    </div>
  );
}

function ManageListing() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900">Manage Public Listing</h2>
      <p className="text-gray-600 mt-2">Update your establishment's public profile</p>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-4">
        <p className="text-gray-500">Listing management coming soon...</p>
      </div>
    </div>
  );
}

// Export Router
export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    Component: TourismHome,
  },
  {
    path: "/explore",
    Component: TourismHome,
  },

  // Admin Login
  {
    path: "/admin/login",
    Component: Login,
  },

  // Officer Routes
  {
    path: "/officer",
    Component: OfficerLayout,
    children: [
      { index: true, Component: OfficerDashboard },
      { path: "establishments", Component: Establishments },
      { path: "visitor-monitoring", Component: VisitorMonitoring },
      { path: "accommodation-monitoring", Component: AccommodationMonitoring },
      { path: "reports", Component: OfficerReports },
      { path: "analytics", Component: OfficerAnalytics },
      { path: "ai-insights", Component: OfficerAIInsights },
    ],
  },

  // Staff Routes
  {
    path: "/staff",
    Component: StaffLayout,
    children: [
      { index: true, Component: StaffDashboard },
      { path: "submit-visitor-report", Component: SubmitVisitorReport },
      { path: "submit-accommodation-report", Component: SubmitAccommodationReport },
      { path: "submission-history", Component: SubmissionHistory },
      { path: "analytics", Component: StaffAnalytics },
      { path: "ai-insights", Component: StaffAIInsights },
      { path: "manage-listing", Component: ManageListing },
    ],
  },

  // 404 - Not Found (must be last)
  {
    path: "*",
    Component: NotFound,
  },
]);