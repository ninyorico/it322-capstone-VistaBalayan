import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Building2,
  Users,
  Bed,
  FileText,
  BarChart3,
  Brain,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { supabase } from "../../lib/supabase";


const menuItems = [
  { path: "/officer", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/officer/establishments", icon: Building2, label: "Establishments & Users" },
  { path: "/officer/visitor-monitoring", icon: Users, label: "Visitor Monitoring" },
  { path: "/officer/accommodation-monitoring", icon: Bed, label: "Accommodation Monitoring" },
  { path: "/officer/reports", icon: FileText, label: "Reports" },
  { path: "/officer/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/officer/ai-insights", icon: Brain, label: "AI Insights" },
];

export default function OfficerLayout() {
  const navigate = useNavigate();


  const [sidebarOpen, setSidebarOpen] = useState(false);


  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

    return (
    <div className="min-h-screen bg-[#F2F5F7]">
      {/* Mobile sidebar overlay*/}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[45] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/*Sidebar Navigation*/}
      <aside
        className={`fixed left-0 top-0 lg:top-0 h-full lg:h-full bg-white border-r border-[#D9E2EC] transition-all duration-300 shadow-xl ${
          sidebarOpen ? "w-64 z-50" : "w-0 lg:w-64 z-40"
        } overflow-hidden`}
      >
        <div className="p-6 border-b border-[#D9E2EC] bg-gradient-to-r from-[#1293B8] to-[#1CA7C9]">
          <h1 className="text-xl font-bold text-white">VistaBalayan</h1>
          <p className="text-sm text-white/80 mt-1">
            Tourism Officer Portal
          </p>
        </div>

        <nav className="p-4 space-y-1.5 overflow-y-auto h-[calc(100vh-130px)] lg:h-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/officer"}
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#1293B8] to-[#1CA7C9] text-white shadow-md"
                    : "text-[#6B7280] hover:bg-[#F2F5F7] hover:text-[#0F172A]"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}