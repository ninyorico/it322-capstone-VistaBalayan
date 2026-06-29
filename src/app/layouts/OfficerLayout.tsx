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


                  <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative p-2.5 hover:bg-[#F2F5F7] rounded-xl transition-colors"
                >
                  <Bell className="w-5 h-5 text-[#6B7280]" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#F59E0B] rounded-full ring-2 ring-white"></span>
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#D9E2EC] z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-[#D9E2EC]">
                      <h3 className="text-sm font-semibold text-[#0F172A]">
                        Notifications
                      </h3>
                    </div>

                    <div className="py-2">
                      <div className="px-4 py-3 hover:bg-[#F2F5F7] transition-colors border-l-4 border-[#F59E0B]">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#FEF3C7] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bell className="w-4 h-4 text-[#F59E0B]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#0F172A]">
                              Pending Review
                            </p>
                            <p className="text-xs text-[#6B7280] mt-1">
                              2 new establishment reports awaiting your review
                            </p>
                            <p className="text-xs text-[#F59E0B] font-medium mt-1">
                              1 hour ago
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 hover:bg-[#F2F5F7] transition-colors border-l-4 border-[#3B82F6]">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#DBEAFE] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bell className="w-4 h-4 text-[#3B82F6]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#0F172A]">
                              Monthly Report Available
                            </p>
                            <p className="text-xs text-[#6B7280] mt-1">
                              May 2026 consolidated tourism report is ready for export
                            </p>
                            <p className="text-xs text-[#6B7280] font-medium mt-1">
                              3 hours ago
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 hover:bg-[#F2F5F7] transition-colors border-l-4 border-[#22C55E]">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#D1FAE5] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bell className="w-4 h-4 text-[#22C55E]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#0F172A]">
                              New Establishment Registered
                            </p>
                            <p className="text-xs text-[#6B7280] mt-1">
                              Balayan Heritage Park has been added to the system
                            </p>
                            <p className="text-xs text-[#6B7280] font-medium mt-1">
                              1 day ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border-t border-[#D9E2EC]">
                      <button className="w-full text-center text-sm font-medium text-[#1CA7C9] hover:text-[#0F4C75] transition-colors">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-8 w-px bg-[#D9E2EC]"></div>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}