import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Building2, MapPin, Phone, UserCog, Mail, Shield, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../../lib/supabase";
import { datestampedFilename, downloadCsv } from "../../../lib/exportCsv";

interface Establishment {
  id: string;
  name: string;
  type: string;
  address: string;
  contact_number: string;
  total_rooms: number;
  status: string;
  staff_count?: number;
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  establishment_id: string | null;
  status: string;
  created_at: string;
}

export default function Establishments() {
  const [activeTab, setActiveTab] = useState<"establishments" | "users">("establishments");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");

  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const [showEstablishmentModal, setShowEstablishmentModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingEstablishment, setEditingEstablishment] = useState<Establishment | null>(null);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "establishment" | "user"; id: string } | null>(null);

  const [establishmentForm, setEstablishmentForm] = useState({
    name: "",
    type: "Hotel",
    address: "",
    contact_number: "",
    total_rooms: 0,
    status: "active",
  });

  const [userForm, setUserForm] = useState({
    full_name: "",
    email: "",
    role: "establishment_staff",
    establishment_id: "",
    status: "active",
  });

  useEffect(() => {
    fetchEstablishments();
    fetchUsers();
  }, []);

  async function fetchEstablishments() {
    setLoading(true);
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Error fetching establishments:", error);
      toast.error("Failed to load establishments");
    } else {
      setEstablishments(data || []);
    }
    setLoading(false);
  }

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data || []);
    }
  }

  const staffCountByEstablishment = users.reduce<Record<string, number>>((counts, user) => {
    if (user.role === "establishment_staff" && user.status !== "inactive" && user.establishment_id) {
      counts[user.establishment_id] = (counts[user.establishment_id] || 0) + 1;
    }
    return counts;
  }, {});

  const filteredEstablishments = establishments.filter((est) => {
    const matchesSearch = est.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || est.type === filterType;
    const matchesStatus = filterStatus === "all" || est.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

}