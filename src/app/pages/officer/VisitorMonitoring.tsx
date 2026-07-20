import { useState, useEffect } from "react";
import { Search, Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../../lib/supabase";
import { datestampedFilename, downloadCsv } from "../../../lib/exportCsv";

interface VisitorRecord {
  id: string;
  establishment: string;
  date: string;
  guestName: string;
  male: number;
  female: number;
  total: number;
  residenceType: string;
  location: string;
}

export default function VisitorMonitoring({ embedded = false }: { embedded?: boolean }) {


  const [visitorRecords, setVisitorRecords] = useState<VisitorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResidence, setFilterResidence] = useState("all");
  const [specificMonth, setSpecificMonth] = useState("");

  useEffect(() => {
    fetchVisitorRecords();
  }, []);

  const fetchVisitorRecords = async () => {
    setLoading(true);
    
    // Fetch visitor reports with establishment names
    const { data, error } = await supabase
      .from("visitor_reports")
      .select(`
        id,
        report_date,
        total_male,
        total_female,
        total_guests,
        residence_type,
        place_of_residence,
        establishments (name)
      `)
      .in("status", ["pending", "approved"])
      .order("report_date", { ascending: false });

    if (error) {
      console.error("Error fetching visitor records:", error);
      setLoading(false);
      return;
    }

    // Transform data for display
    const formattedRecords: VisitorRecord[] = (data || []).map((item: any) => ({
      id: item.id,
      establishment: item.establishments?.name || "Unknown",
      date: item.report_date,
      guestName: "N/A", // Note: guest_name field doesn't exist in your schema
      male: item.total_male || 0,
      female: item.total_female || 0,
      total: item.total_guests || 0,
      residenceType: item.residence_type || "Unknown",
      location: item.place_of_residence || "Unknown",
    }));

    setVisitorRecords(formattedRecords);
    setLoading(false);
  };

  // Filter records based on search, residence, date/month
  const filteredRecords = visitorRecords.filter((record) => {
    const matchesSearch = 
      record.establishment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesResidence = filterResidence === "all" || record.residenceType === filterResidence;
      
    let matchesDate = true;
    if (specificMonth) {
      matchesDate = record.date.startsWith(specificMonth);
    }
    
    return matchesSearch && matchesResidence && matchesDate;
  });

  const totalVisitors = filteredRecords.reduce((sum, r) => sum + r.total, 0);
  const totalMale = filteredRecords.reduce((sum, r) => sum + r.male, 0);
  const totalFemale = filteredRecords.reduce((sum, r) => sum + r.female, 0);

  const handleExport = () => {
    downloadCsv(
      datestampedFilename("visitor-records"),
      ["Date", "Establishment", "Guest/Group", "Male", "Female", "Total", "Residence Type", "Location"],
      filteredRecords.map((record) => [
        record.date,
        record.establishment,
        record.guestName,
        record.male,
        record.female,
        record.total,
        record.residenceType,
        record.location,
      ])
    );
    toast.success(`Exported ${filteredRecords.length} visitor record(s)`);
  };
