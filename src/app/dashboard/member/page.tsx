//create the dashboard member page // instead of slug take note_id from the user_id
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ProfileInformation from "@/helper/ProfileInformation";
import CreateNote from "./components/CreateNote";
import DeleteNote from "./components/DeleteNote";
import UpdateNote from "./components/UpdateNote";
import Logout from "@/helper/Logout";
import GetANote from "./components/GetANote";

interface User { 
  name: string;
  email: string;
  role: string;
  isAddingMembers: boolean;
  isUpgradingPlan: boolean;
}

export default function MemberDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [noteId, setNoteId] = useState(""); // noteId from input

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
      <h1 className="text-2xl font-bold">Member Dashboard</h1>
      {/* take noteid from the user */}
      <input
        type="text"
        placeholder="Enter your note ID"
        className="border p-2 rounded"
        value={noteId}
        onChange={(e) => setNoteId(e.target.value)}
      />
      <ProfileInformation user={user} />
      {noteId && <CreateNote/>}
      {noteId && <UpdateNote noteId={noteId} />}
      {noteId && <DeleteNote noteId={noteId} />}
      {noteId && <GetANote noteId={noteId} />}
      <Logout />
    </div>
  );
}
