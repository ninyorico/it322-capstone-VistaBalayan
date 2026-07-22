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


}