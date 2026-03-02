import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Trash2,
  Key,
  Loader2,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const profileSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  address: z.string().min(5, "Please enter a more detailed address"),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    rePassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

const Profile = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState("");
  const navigate = useNavigate();

  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: regPass,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    formState: { errors: passErrors, isSubmitting: passSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/me");
      setUser(res.data);
      resetProfile({
        fullName: res.data.fullName,
        phone: res.data.phone,
        address: res.data.address,
      });
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onUpdateProfile = async (data) => {
    setUpdating(true);
    try {
      await api.patch(`/user/update-profile`, data);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleDpChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("dpImage", file);
    try {
      setUpdating(true);
      await api.post("/user/update-dp", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Photo updated!");
      fetchProfile();
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUpdating(false);
    }
  };

  const onSubmitPassword = async (data) => {
    try {
      await api.post("/auth/change-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully!");
      resetPass();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };

  const handleFinalDeactivate = async () => {
    if (!deactivatePassword)
      return toast.error("Password required to Delete Account");
    try {
      await api.patch(`/auth/update-status/${user.id}`, {
        password: deactivatePassword,
      });
      toast.success("Account deactivated.");
      localStorage.clear();
      onLogout();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Incorrect password");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-emerald-500" />
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 no-scrollbar">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-serif italic text-white/90">
            Account Settings
          </h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black mt-3 ml-1">
            Personalize & Secure
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: Identity Card */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="sticky top-24 w-full flex flex-col items-center">
              <div className="relative group">
                <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-[3rem] border-2 border-white/5 overflow-hidden bg-zinc-900 flex items-center justify-center group-hover:border-emerald-500/30 transition-all duration-500 shadow-2xl">
                  {user?.dp ? (
                    <img
                      src={`http://localhost:5002/${user.dp}`}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <User size={80} className="text-zinc-800" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-emerald-500 p-4 rounded-3xl cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-2xl text-black">
                  <Camera size={22} strokeWidth={2.5} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleDpChange}
                  />
                </label>
              </div>
              <h2 className="mt-8 font-bold text-2xl tracking-tight">
                {user?.fullName}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Sections */}
          <div className="lg:col-span-8 space-y-10">
            {/* 1. General Info */}
            <section className="bg-zinc-900/40 p-8 lg:p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
              <h3 className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-8 flex items-center gap-2">
                <User size={14} /> Basic Information
              </h3>
              <form
                onSubmit={handleProfileSubmit(onUpdateProfile)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name Input */}
                  <div className="space-y-2">
                    <label className="text-zinc-500 text-[9px] uppercase font-black ml-1">
                      Full Identity
                    </label>
                    <input
                      {...regProfile("fullName")}
                      className={`w-full bg-black/40 border ${profileErrors.fullName ? "border-red-500/50" : "border-white/10"} rounded-2xl px-5 py-4 mt-1 outline-none focus:border-emerald-500/40 transition-all`}
                    />
                    {profileErrors.fullName && (
                      <p className="text-red-400 text-[10px] mt-1 ml-2 italic">
                        {profileErrors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-2">
                    <label className="text-zinc-500 text-[9px] uppercase font-black ml-1">
                      Contact Phone
                    </label>
                    <input
                      {...regProfile("phone")}
                      placeholder="98XXXXXXXX"
                      className={`w-full bg-black/40 border ${profileErrors.phone ? "border-red-500/50" : "border-white/10"} rounded-2xl px-5 py-4 mt-1 outline-none focus:border-emerald-500/40`}
                    />
                    {profileErrors.phone && (
                      <p className="text-red-400 text-[10px] mt-1 ml-2 italic">
                        {profileErrors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Address Input */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-zinc-500 text-[9px] uppercase font-black ml-1">
                      Mailing Address
                    </label>
                    <input
                      {...regProfile("address")}
                      className={`w-full bg-black/40 border ${profileErrors.address ? "border-red-500/50" : "border-white/10"} rounded-2xl px-5 py-4 mt-1 outline-none focus:border-emerald-500/40`}
                    />
                    {profileErrors.address && (
                      <p className="text-red-400 text-[10px] mt-1 ml-2 italic">
                        {profileErrors.address.message}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  disabled={updating}
                  type="submit"
                  className="w-full py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-[0.98]"
                >
                  {updating ? "Processing..." : "Save Profile"}
                </button>
              </form>
            </section>

            {/* 2. Security (Password) */}
            <section className="bg-zinc-900/40 p-8 lg:p-10 rounded-[2.5rem] border border-white/5">
              <h3 className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-8 flex items-center gap-2">
                <Key size={14} /> Security & Passwords
              </h3>
              <form
                onSubmit={handlePassSubmit(onSubmitPassword)}
                className="space-y-5"
              >
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Current Password"
                    {...regPass("oldPassword")}
                    className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-white/20"
                  />
                  {passErrors.oldPassword && (
                    <p className="text-red-400 text-[10px] mt-1 ml-2 italic">
                      {passErrors.oldPassword.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <input
                      type="password"
                      placeholder="New Password"
                      {...regPass("newPassword")}
                      className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-white/20"
                    />
                    {passErrors.newPassword && (
                      <p className="text-red-400 text-[10px] mt-1 ml-2 italic">
                        {passErrors.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Repeat New Password"
                      {...regPass("rePassword")}
                      className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-white/20"
                    />
                    {passErrors.rePassword && (
                      <p className="text-red-400 text-[10px] mt-1 ml-2 italic">
                        {passErrors.rePassword.message}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  disabled={passSubmitting}
                  type="submit"
                  className="w-full py-5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all"
                >
                  {passSubmitting ? "Updating Keys..." : "Update Password"}
                </button>
              </form>
            </section>

            {/* 3. Deactivation Zone */}
            <section className="bg-red-500/[0.03] border border-red-500/10 p-8 lg:p-10 rounded-[2.5rem] space-y-6">
              {!isDeactivating ? (
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <p className="text-zinc-500 text-xs">
                    Temporarily disable your account and hide your profile from
                    others.
                  </p>
                  <button
                    onClick={() => setIsDeactivating(true)}
                    className="px-8 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-bold uppercase hover:bg-red-500 hover:text-white transition-all whitespace-nowrap"
                  >
                    Deactivate Account
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                    <ShieldAlert size={18} /> Please verify your password to
                    continue
                  </div>
                  <div className="flex flex-col md:flex-row gap-3">
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="flex-1 bg-black/40 border border-red-500/20 rounded-xl px-4 py-3 outline-none focus:border-red-500"
                      onChange={(e) => setDeactivatePassword(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleFinalDeactivate}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-red-700 transition-all"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setIsDeactivating(false)}
                        className="px-6 py-3 bg-zinc-800 text-zinc-400 rounded-xl text-[10px] font-bold uppercase hover:bg-zinc-700 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
