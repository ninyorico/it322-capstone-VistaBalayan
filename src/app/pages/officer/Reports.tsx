
import { useState, useEffect } from "react";
import {
  Download,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Eye,
  X,
  TrendingUp,
  TrendingDown,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { supabase } from "../../../lib/supabase";

interface Submission {
  id: string;
  establishment: string;
  type: "Visitor Report" | "Accommodation Report";
  reportDate: string;
  visitors: number;
  submitted: string;
  status: string;
  reviewedBy?: string;
  reviewedDate?: string;
  notes?: string;
  details: any;
}

export default function Reports() {


  const [filterType, setFilterType] = useState<"year" | "month" | "date">("month");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [visitorStats, setVisitorStats] = useState({
    currentTotal: 0,
    previousTotal: 0,
    difference: 0,
    percentageChange: "0",
    isIncrease: true,
  });

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const fetchSubmissions = async () => {
    setLoading(true);
    
    const { data: visitorData, error: visitorError } = await supabase
      .from("visitor_reports")
      .select(`
        *,
        establishments!visitor_reports_establishment_id_fkey (
          name
        )
      `)
      .order("created_at", { ascending: false });

    if (visitorError) console.error("Visitor reports error:", visitorError);

    const { data: accommodationData, error: accError } = await supabase
      .from("accommodation_reports")
      .select(`
        *,
        establishments!accommodation_reports_establishment_id_fkey (
          name
        )
      `)
      .order("created_at", { ascending: false });

    if (accError) console.error("Accommodation reports error:", accError);

    const getEstablishmentName = (item: any) => {
      if (item.establishments) {
        if (Array.isArray(item.establishments) && item.establishments.length > 0) {
          return item.establishments[0].name;
        } else if (item.establishments.name) {
          return item.establishments.name;
        }
      }
      return "Unknown";
    };

    const visitorSubmissions: Submission[] = (visitorData || []).map((item: any) => ({
      id: item.id,
      establishment: getEstablishmentName(item),
      type: "Visitor Report",
      reportDate: item.report_date,
      visitors: item.total_guests || 0,
      submitted: new Date(item.created_at).toISOString().slice(0, 10),
      status: item.status,
      reviewedBy: item.reviewed_by ? "Municipal Tourism Officer" : undefined,
      reviewedDate: item.reviewed_at ? new Date(item.reviewed_at).toISOString().slice(0, 10) : undefined,
      notes: item.notes,
      details: item,
    }));

    const accommodationSubmissions: Submission[] = (accommodationData || []).map((item: any) => ({
      id: item.id,
      establishment: getEstablishmentName(item),
      type: "Accommodation Report",
      reportDate: item.report_date,
      visitors: item.total_check_ins || 0,
      submitted: new Date(item.created_at).toISOString().slice(0, 10),
      status: item.status,
      reviewedBy: item.reviewed_by ? "Municipal Tourism Officer" : undefined,
      reviewedDate: item.reviewed_at ? new Date(item.reviewed_at).toISOString().slice(0, 10) : undefined,
      notes: item.notes,
      details: item,
    }));

    const combined = [...visitorSubmissions, ...accommodationSubmissions].sort(
      (a, b) => new Date(b.submitted).getTime() - new Date(a.submitted).getTime()
    );
    setSubmissions(combined);
    setLoading(false);
  };

  const fetchChartData = async () => {
    let startDate = "";
    let endDate = "";
    
    // Build date range based on selected filter type
    if (filterType === "date" && selectedDate) {
      startDate = selectedDate;
      endDate = selectedDate;
    } else if (filterType === "month" && selectedYear && selectedMonth) {
      const monthNum = months.indexOf(selectedMonth) + 1;
      const monthStr = String(monthNum).padStart(2, '0');
      const lastDay = new Date(parseInt(selectedYear), monthNum, 0).getDate();
      startDate = `${selectedYear}-${monthStr}-01`;
      endDate = `${selectedYear}-${monthStr}-${String(lastDay).padStart(2, '0')}`;
    } else if (filterType === "year" && selectedYear) {
      startDate = `${selectedYear}-01-01`;
      endDate = `${selectedYear}-12-31`;
    } else {
      // Default: show all 2025 data
      startDate = "2025-01-01";
      endDate = "2025-12-31";
    }

    const { data } = await supabase
      .from("visitor_reports")
      .select("report_date, total_guests")
      .in("status", ["pending", "approved"])
      .gte("report_date", startDate)
      .lte("report_date", endDate)
      .order("report_date", { ascending: true });

    if (data && data.length) {
      const grouped: Record<string, number> = {};
      data.forEach((item: any) => {
        const date = new Date(item.report_date);
        let key = "";
        
        if (filterType === "date") {
          key = item.report_date;
        } else if (filterType === "month") {
          const week = Math.ceil(date.getDate() / 7);
          key = `Week ${week}`;
        } else {
          key = date.toLocaleString('default', { month: 'short' });
        }
        grouped[key] = (grouped[key] || 0) + (item.total_guests || 0);
      });

      const chartDataArray = Object.entries(grouped).map(([period, visitors]) => ({
        period,
        visitors,
      }));
      setChartData(chartDataArray);
      
      const currentTotal = chartDataArray[chartDataArray.length - 1]?.visitors || 0;
      const previousTotal = chartDataArray[chartDataArray.length - 2]?.visitors || 0;
      const difference = currentTotal - previousTotal;
      const percentageChange = previousTotal > 0 ? ((difference / previousTotal) * 100).toFixed(1) : "0";
      setVisitorStats({
        currentTotal,
        previousTotal,
        difference,
        percentageChange,
        isIncrease: difference > 0,
      });
    } else {
      setChartData([]);
      setVisitorStats({
        currentTotal: 0,
        previousTotal: 0,
        difference: 0,
        percentageChange: "0",
        isIncrease: true,
      });
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    fetchChartData();
  }, [filterType, selectedYear, selectedMonth, selectedDate]);
