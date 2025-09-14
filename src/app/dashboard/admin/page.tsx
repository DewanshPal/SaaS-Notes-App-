"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ToggleControls from "./components/ToggleControls";
import UpgradeFlow from "./components/UpgradeFlow";
import ProfileInformation from "@/helper/ProfileInformation";
import InviteMemberForm from "./components/InviteMemberForm";
import ViewAllNotes from "./components/ViewAllNotes";
import Logout from "@/helper/Logout";

interface User { 
  username: string;
  email: string;
  role: string;
  isAddingMembers: boolean;
  isUpgradingPlan: boolean;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [slug, setSlug] = useState(""); // slug from input
  const [viewAllNotes, setViewAllNotes] = useState(false);

  // Initial fetch of profile info
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("/api/users/me");
        setUser(res.data.user);
        toast.success("Profile loaded successfully!");
      } catch (err) {
        console.error("Failed to load profile", err);
        toast.error("Failed to load profile");
      }
    }
    fetchUser();
  }, []);

  if (!user) return <p>Loading dashboard...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      
      <ProfileInformation user={user} />


      {user?.role === "ADMIN" && <ToggleControls user={user} onUserUpdate={setUser} />}

      <div className="p-4 border rounded-lg shadow-md">
        <label className="block text-sm font-medium mb-2">
          Tenant Slug
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Enter your tenant slug (e.g. openai-inc)"
          className="w-full border px-3 py-2 rounded"
        />
        <button
          onClick={() => setViewAllNotes(true)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          View All Notes
        </button>
      </div>
      {user.isUpgradingPlan && slug && <UpgradeFlow slug={slug} />}
      {user.isAddingMembers && slug && <InviteMemberForm slug={slug} />}
      {viewAllNotes && <ViewAllNotes />}
      <Logout/>
    </div>
  );
}
