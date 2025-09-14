"use client";

import axios from "axios";
import { toast } from "react-hot-toast";

interface ToggleControlsProps {
  user: {
    isAddingMembers: boolean;
    isUpgradingPlan: boolean;
  };
  onUserUpdate: (updatedUser: any) => void;
}

export default function ToggleControls({ user, onUserUpdate }: ToggleControlsProps) {
  async function toggleFlag(flag: string, value: boolean) {
    try {
      const res = await axios.patch("/api/admin/update-flags", { flag, value });
      onUserUpdate(res.data.user); // update parent state immediately
      toast.success(`Successfully updated ${flag} to ${value}`);
    } catch (err) {
      console.error("Failed to update flag", err);
      toast.error("Failed to update flag");
    }
  }


  return (
    <div className="space-y-4">
      <div>
        <label className="mr-2">Add Members</label>
        <input
          type="checkbox"
          checked={user.isAddingMembers}
          onChange={(e) => toggleFlag("isAddingMembers", e.target.checked)}
        />
      </div>

      <div>
        <label className="mr-2">Upgrade Plan</label>
        <input
          type="checkbox"
          checked={user.isUpgradingPlan}
          onChange={(e) => toggleFlag("isUpgradingPlan", e.target.checked)}
        />
      </div>
    </div>
  );
}

