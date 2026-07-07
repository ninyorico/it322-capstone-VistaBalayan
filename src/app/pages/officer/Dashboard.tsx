import { useEffect, useState } from "react";
import {
  Users,
  TrendingUp,
  Bed,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../../../lib/supabase";


/* Data Structures / Type Definitions */

interface RecentSubmission {
  id: string;
  establishment_name: string;
  type: string;
  status: string;
  date: string;
  created_at: string;
}

interface TopEstablishment {
  name: string;
  visitors: number;
}

interface Demographic {
  name: string;
  value: number;
  color: string;
}


export default function OfficerDashboard() {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [totalVisitorsChange, setTotalVisitorsChange] = useState({ value: 0, isIncrease: true });
  const [monthlyArrivals, setMonthlyArrivals] = useState(0);
  const [monthlyArrivalsChange, setMonthlyArrivalsChange] = useState({ value: 0, isIncrease: true });
  const [occupancyRate, setOccupancyRate] = useState(0);
  const [occupancyRateChange, setOccupancyRateChange] = useState({ value: 0, isIncrease: true });
  const [totalEstablishments, setTotalEstablishments] = useState(0);
  const [newEstablishments, setNewEstablishments] = useState(0);
  const [visitorTrends, setVisitorTrends] = useState<any[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [demographics, setDemographics] = useState<Demographic[]>([]);
  const [topEstablishments, setTopEstablishments] = useState<TopEstablishment[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  const fetchAllDashboardData = async () => {
    setLoading(true);

    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth - 1;
    const twoMonthsAgo = currentMonth - 2;


    const { data: visitorData, error: visitorError } = await supabase
      .from("visitor_reports")
      .select("report_date, total_guests")
      .eq("status", "approved");

    if (!visitorError && visitorData) {
      const currentYearVisitors = visitorData
        .filter(v => new Date(v.report_date).getFullYear() === currentYear)
        .reduce((sum, v) => sum + (v.total_guests || 0), 0);
      
      const lastYearVisitors = visitorData
        .filter(v => new Date(v.report_date).getFullYear() === lastYear)
        .reduce((sum, v) => sum + (v.total_guests || 0), 0);
      
      setTotalVisitors(currentYearVisitors);
      
      const yearChange = lastYearVisitors > 0 
        ? ((currentYearVisitors - lastYearVisitors) / lastYearVisitors) * 100 
        : 0;
      setTotalVisitorsChange({
        value: Math.abs(yearChange),
        isIncrease: yearChange >= 0,
      });

      // Monthly trends
      const monthly: Record<string, number> = {};
      visitorData.forEach((v) => {
        const month = new Date(v.report_date).toLocaleString('default', { month: 'short' });
        monthly[month] = (monthly[month] || 0) + (v.total_guests || 0);
      });
      const trends = Object.entries(monthly).map(([month, visitors]) => ({ month, visitors }));
      setVisitorTrends(trends);

      // Monthly arrivals (this month vs last month)
      const thisMonthVisitors = visitorData
        .filter(v => new Date(v.report_date).getMonth() === currentMonth)
        .reduce((sum, v) => sum + (v.total_guests || 0), 0);
      
      const lastMonthVisitors = visitorData
        .filter(v => new Date(v.report_date).getMonth() === lastMonth)
        .reduce((sum, v) => sum + (v.total_guests || 0), 0);
      
      setMonthlyArrivals(thisMonthVisitors);
      
      const monthChange = lastMonthVisitors > 0 
        ? ((thisMonthVisitors - lastMonthVisitors) / lastMonthVisitors) * 100 
        : 0;
      setMonthlyArrivalsChange({
        value: Math.abs(monthChange),
        isIncrease: monthChange >= 0,
      });
    }


    const { data: accommodationData, error: accError } = await supabase
      .from("accommodation_reports")
      .select("report_date, total_rooms, total_occupied_rooms")
      .eq("status", "approved");

    if (!accError && accommodationData && accommodationData.length > 0) {
      const currentMonthOcc = accommodationData.filter(a => new Date(a.report_date).getMonth() === currentMonth);
      const lastMonthOcc = accommodationData.filter(a => new Date(a.report_date).getMonth() === lastMonth);
      
      const currentTotalRooms = currentMonthOcc.reduce((sum, a) => sum + (a.total_rooms || 0), 0);
      const currentTotalOccupied = currentMonthOcc.reduce((sum, a) => sum + (a.total_occupied_rooms || 0), 0);
      const currentRate = currentTotalRooms > 0 ? (currentTotalOccupied / currentTotalRooms) * 100 : 0;
      
      const lastTotalRooms = lastMonthOcc.reduce((sum, a) => sum + (a.total_rooms || 0), 0);
      const lastTotalOccupied = lastMonthOcc.reduce((sum, a) => sum + (a.total_occupied_rooms || 0), 0);
      const lastRate = lastTotalRooms > 0 ? (lastTotalOccupied / lastTotalRooms) * 100 : 0;
      
      setOccupancyRate(currentRate);
      
      const rateChange = lastRate > 0 ? ((currentRate - lastRate) / lastRate) * 100 : 0;
      setOccupancyRateChange({
        value: Math.abs(rateChange),
        isIncrease: rateChange >= 0,
      });
    }


    const { data: establishmentsData, error: estError } = await supabase
      .from("establishments")
      .select("created_at");

    if (!estError && establishmentsData) {
      setTotalEstablishments(establishmentsData.length);
      
      const newThisMonth = establishmentsData.filter(e => {
        const createdAt = new Date(e.created_at);
        return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
      }).length;
      setNewEstablishments(newThisMonth);
    }


    const { data: demoData } = await supabase
      .from("visitor_reports")
      .select("residence_type, total_guests")
      .eq("status", "approved");

    if (demoData && demoData.length > 0) {
      const dist: Record<string, number> = {};
      demoData.forEach((item) => {
        const type = item.residence_type || "Unknown";
        dist[type] = (dist[type] || 0) + (item.total_guests || 0);
      });
      const total = Object.values(dist).reduce((a, b) => a + b, 0);
      const chartData = Object.entries(dist).map(([name, value]) => ({
        name,
        value: total > 0 ? Math.round((value / total) * 100) : 0,
        color: name === "Batangas Resident" ? "#3b82f6" : name === "Outside Batangas" ? "#8b5cf6" : "#10b981",
      }));
      setDemographics(chartData);
    }

    const { data: topData } = await supabase
      .from("visitor_reports")
      .select(`establishment_id, total_guests, establishments(name)`)
      .eq("status", "approved");

    if (topData && topData.length > 0) {
      const stats: Record<string, { name: string; visitors: number }> = {};
      topData.forEach((item: any) => {
        const id = item.establishment_id;
        const name = item.establishments?.name;
        if (id && name) {
          if (!stats[id]) stats[id] = { name, visitors: 0 };
          stats[id].visitors += item.total_guests || 0;
        }
      });
      const sorted = Object.values(stats).sort((a, b) => b.visitors - a.visitors).slice(0, 5);
      setTopEstablishments(sorted);
    }


    // 6. Recent submissions
    const { data: visitorRecent } = await supabase
      .from("visitor_reports")
      .select(`id, report_date, status, created_at, establishments(name)`)
      .order("created_at", { ascending: false })
      .limit(3);

    const { data: accommodationRecent } = await supabase
      .from("accommodation_reports")
      .select(`id, report_date, status, created_at, establishments(name)`)
      .order("created_at", { ascending: false })
      .limit(3);

    const combined = [
      ...(visitorRecent || []).map((v: any) => ({
        id: v.id,
        establishment_name: v.establishments?.name || "Unknown",
        type: "Visitor Report",
        status: v.status,
        date: v.report_date,
        created_at: v.created_at,
      })),
      ...(accommodationRecent || []).map((a: any) => ({
        id: a.id,
        establishment_name: a.establishments?.name || "Unknown",
        type: "Accommodation Report",
        status: a.status,
        date: a.report_date,
        created_at: a.created_at,
      })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
     .slice(0, 5);

    setRecentSubmissions(combined);


    // 7. Anomalies
    const { data: anomalyData } = await supabase
      .from("ai_anomalies")
      .select("*")
      .eq("status", "active")
      .order("detected_at", { ascending: false })
      .limit(5);
    setAnomalies(anomalyData || []);

    setLoading(false);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1CA7C9] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

 {/* KPI Cards with real comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI Card 1: Total Visitors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Visitors</p>
              <p className="text-3xl font-bold text-gray-900">{totalVisitors.toLocaleString()}</p>
              {totalVisitorsChange.value > 0 && (
                <p className={`text-sm mt-1 ${totalVisitorsChange.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                  {totalVisitorsChange.isIncrease ? '+' : '-'}{totalVisitorsChange.value.toFixed(1)}% vs last year
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/*KPI Card 2: Monthly Arrivals */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Arrivals</p>
              <p className="text-3xl font-bold text-gray-900">{monthlyArrivals.toLocaleString()}</p>
              {monthlyArrivalsChange.value > 0 && (
                <p className={`text-sm mt-1 ${monthlyArrivalsChange.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                  {monthlyArrivalsChange.isIncrease ? '+' : '-'}{monthlyArrivalsChange.value.toFixed(1)}% vs last month
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* KPI Card 3: Occupancy Rate */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Occupancy Rate</p>
              <p className="text-3xl font-bold text-gray-900">{occupancyRate.toFixed(1)}%</p>
              {occupancyRateChange.value > 0 && (
                <p className={`text-sm mt-1 ${occupancyRateChange.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                  {occupancyRateChange.isIncrease ? '+' : '-'}{occupancyRateChange.value.toFixed(1)}% vs last month
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Bed className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/*  KPI Card 4: Total Establishments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Establishments</p>
              <p className="text-3xl font-bold text-gray-900">{totalEstablishments}</p>
              {newEstablishments > 0 && (
                <p className="text-sm text-green-600 mt-1">+{newEstablishments} this month</p>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>



  {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Visitor Trends</h3>
          {visitorTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={visitorTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="visitors" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Visitors" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">No visitor data available yet</div>
          )}
        </div>

        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitor Demographics</h3>
          {demographics.length > 0 && demographics.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={demographics} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={100} dataKey="value">
                  {demographics.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">No demographic data available yet</div>
          )}
        </div>
      </div>

     

      {/* Top Performing Establishments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Establishments (by visitors)</h3>
        {topEstablishments.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topEstablishments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visitors" fill="#3b82f6" name="Visitors" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500">No establishment data available yet</div>
        )}
      </div>

    