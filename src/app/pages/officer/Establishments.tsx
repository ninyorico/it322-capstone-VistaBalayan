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

    const handleAddEstablishment = () => {
      setEditingEstablishment(null);
      setEstablishmentForm({
        name: "",
        type: "Hotel",
        address: "",
        contact_number: "",
        total_rooms: 0,
        status: "active",
      });
      setShowEstablishmentModal(true);
    };

    const handleEditEstablishment = (id: string) => {
      const establishment = establishments.find((e) => e.id === id);
      if (establishment) {
        setEditingEstablishment(establishment);
        setEstablishmentForm({
          name: establishment.name,
          type: establishment.type,
          address: establishment.address,
          contact_number: establishment.contact_number,
          total_rooms: establishment.total_rooms,
          status: establishment.status,
        });
        setShowEstablishmentModal(true);
      }
    };

    const handleSaveEstablishment = async () => {
      if (!establishmentForm.name || !establishmentForm.address || !establishmentForm.contact_number) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (editingEstablishment) {
        const { error } = await supabase
          .from('establishments')
          .update({
            name: establishmentForm.name,
            type: establishmentForm.type,
            address: establishmentForm.address,
            contact_number: establishmentForm.contact_number,
            total_rooms: establishmentForm.total_rooms,
            status: establishmentForm.status,
          })
          .eq('id', editingEstablishment.id);
        
        if (error) {
          toast.error("Failed to update: " + error.message);
        } else {
          toast.success("Establishment updated successfully");
          fetchEstablishments();
          setShowEstablishmentModal(false);
        }
      } else {
        const { error } = await supabase
          .from('establishments')
          .insert([{
            name: establishmentForm.name,
            type: establishmentForm.type,
            address: establishmentForm.address,
            contact_number: establishmentForm.contact_number,
            total_rooms: establishmentForm.total_rooms,
            status: establishmentForm.status,
          }]);
        
        if (error) {
          toast.error("Failed to add: " + error.message);
        } else {
          toast.success("Establishment added successfully");
          fetchEstablishments();
          setShowEstablishmentModal(false);
        }
      }
    };

    const handleDeleteEstablishment = (id: string) => {
      setDeleteTarget({ type: "establishment", id });
      setShowDeleteConfirm(true);
    };

    const handleAddUser = () => {
      setEditingUser(null);
      setUserForm({
        full_name: "",
        email: "",
        role: "establishment_staff",
        establishment_id: "",
        status: "active",
      });
      setShowUserModal(true);
    };

    const handleEditUser = (id: string) => {
      const user = users.find((u) => u.id === id);
      if (user) {
        setEditingUser(user);
        setUserForm({
          full_name: user.full_name || "",
          email: user.email,
          role: user.role,
          establishment_id: user.establishment_id || "",
          status: user.status || "active",
        });
        setShowUserModal(true);
      }
    };

    const handleSaveUser = async () => {
      if (!userForm.full_name || !userForm.email) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (editingUser) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: userForm.full_name,
            role: userForm.role,
            establishment_id: userForm.establishment_id || null,
            status: userForm.status,
          })
          .eq('id', editingUser.id);
        
        if (error) {
          toast.error("Failed to update: " + error.message);
        } else {
          toast.success("User updated successfully");
          fetchUsers();
          setShowUserModal(false);
        }
      } else {
        toast.info("To add new users, please use Supabase Authentication dashboard first, then assign them here.");
      }
    };

    const handleDeleteUser = (id: string) => {
      setDeleteTarget({ type: "user", id });
      setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
      if (!deleteTarget) return;

      if (deleteTarget.type === "establishment") {
        const { error } = await supabase
          .from('establishments')
          .delete()
          .eq('id', deleteTarget.id);
        
        if (error) {
          toast.error("Failed to delete: " + error.message);
        } else {
          toast.success("Establishment deleted successfully");
          fetchEstablishments();
        }
      } else {
        const { error } = await supabase
          .from('profiles')
          .update({ status: 'inactive' })
          .eq('id', deleteTarget.id);
        
        if (error) {
          toast.error("Failed to deactivate user: " + error.message);
        } else {
          toast.success("User deactivated successfully");
          fetchUsers();
        }
      }
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    };

      const handleExportEstablishments = () => {
    downloadCsv(
      datestampedFilename("establishments"),
      ["Name", "Type", "Address", "Contact", "Rooms", "Staff", "Status"],
      filteredEstablishments.map((establishment) => [
        establishment.name,
        establishment.type,
        establishment.address,
        establishment.contact_number,
        establishment.total_rooms || 0,
        staffCountByEstablishment[establishment.id] || 0,
        establishment.status,
      ])
    );
    toast.success(`Exported ${filteredEstablishments.length} establishment(s)`);
  };

  const handleExportUsers = () => {
    downloadCsv(
      datestampedFilename("users"),
      ["Full Name", "Email", "Role", "Establishment", "Status", "Created At"],
      filteredUsers.map((user) => {
        const establishment = establishments.find((e) => e.id === user.establishment_id);
        return [
          user.full_name || "Unknown",
          user.email,
          user.role === "municipal_officer" ? "Municipal Tourism Officer" : "Establishment Staff",
          establishment?.name || "N/A",
          user.status,
          user.created_at,
        ];
      })
    );
    toast.success(`Exported ${filteredUsers.length} user(s)`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#1CA7C9]" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Establishments & Users</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage tourism establishments and system users
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={activeTab === "establishments" ? handleExportEstablishments : handleExportUsers}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm sm:text-base whitespace-nowrap"
          >
            Export {activeTab === "establishments" ? "Establishments" : "Users"}
          </button>
          <button
            onClick={activeTab === "establishments" ? handleAddEstablishment : handleAddUser}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base whitespace-nowrap"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">{activeTab === "establishments" ? "Add Establishment" : "Add User"}</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("establishments")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === "establishments"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Establishments</span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === "users"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <UserCog className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Users</span>
          </button>
        </div>
      </div>

      {activeTab === "establishments" ? (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search establishments..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1CA7C9]/50 focus:border-[#1CA7C9] outline-none transition-all"
                >
                  <option value="all">All Types</option>
                  <option value="Resort">Resort</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Inn">Inn</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Tourist Attraction">Tourist Attraction</option>
                  <option value="Food & Beverage Establishment">Food & Beverage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1CA7C9]/50 focus:border-[#1CA7C9] outline-none transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

}