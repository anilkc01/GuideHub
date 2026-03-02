import React, { useState, useEffect } from "react";
import { Search, MoreVertical, MapPin, Mail, Phone, User } from "lucide-react";
import api from "../../api/axios";
import UserDetailCard from "./UserDetailCard";

const UsersPage = ({ type }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/admin/users?role=${type}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [type]);

  return (
    <div className="w-full h-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header and Search Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
          Registered{" "}
          <span className="text-[#E2E675]">
            {type === "guide" ? "Guides" : "Trekkers"}
          </span>
        </h1>

        <div className="relative w-full md:w-96 group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#E2E675] transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full bg-zinc-900/80 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-[#E2E675]/40 focus:ring-1 focus:ring-[#E2E675]/40 transition-all placeholder:text-zinc-600 shadow-xl"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table Container (Right Side Content) */}
      <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 bg-white/[0.01]">
                <th className="px-10 py-7">User Details</th>
                <th className="px-6 py-7">Contact Information</th>
                <th className="px-6 py-7">Location / Address</th>
                <th className="px-10 py-7 text-right">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  {/* User Details (DP & Name) */}
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-14 h-14 shrink-0 rounded-2xl border border-white/10 bg-zinc-900 flex items-center justify-center transition-all group-hover:border-[#E2E675]/30 shadow-lg overflow-hidden">
                          {user.dp ? (
                            <img
                              src={`http://localhost:5002/${user.dp}`}
                              className="w-full h-full object-cover"
                              alt="User Profile"
                            />
                          ) : (
                            <User
                              size={28}
                              className="text-zinc-600"
                              strokeWidth={1.5}
                            />
                          )}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-950 ${user.status === "active" ? "bg-emerald-500" : "bg-red-500"}`}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-zinc-100 group-hover:text-white transition-colors">
                          {user.fullName}
                        </p>
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info (Email & Phone) */}
                  <td className="px-6 py-6 text-zinc-400">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2.5 text-sm font-medium">
                        <Mail size={14} className="text-zinc-600" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-wide">
                        <Phone size={14} className="text-zinc-600" />
                        {user.phone}
                      </div>
                    </div>
                  </td>

                  {/* Location (Address) */}
                  <td className="px-6 py-6">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-zinc-900/80 border border-white/5 text-xs text-zinc-400 font-medium">
                      <MapPin size={14} className="text-[#E2E675]" />
                      {user.address || "No Address Provided"}
                    </div>
                  </td>

                  {/* Account Status */}
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-5">
                      <span
                        className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                          user.status === "active"
                            ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5"
                            : "border-red-500/20 text-red-500 bg-red-500/5"
                        }`}
                      >
                        {user.status}
                      </span>
                      <button className="p-2.5 hover:bg-white/5 rounded-xl text-zinc-600 hover:text-white transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedUserId && (
        <UserDetailCard
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onUpdate={() => fetchUsers()}
        />
      )}
    </div>
  );
};

export default UsersPage;
