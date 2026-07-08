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
x
