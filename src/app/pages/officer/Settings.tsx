import { useState, useEffect } from "react";
import { Save, User, Mail, Phone, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../../lib/supabase";

export default function OfficerProfile() {

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    contact_number: "",
    position: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      setFormData({
        full_name: profileData.full_name || "",
        contact_number: profileData.contact_number || "",
        position: profileData.position || "Municipal Tourism Officer",
        new_password: "",
        confirm_password: "",
      });
    }

    setLoading(false);
  };