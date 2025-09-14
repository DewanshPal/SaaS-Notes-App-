"use client";

import axios from "axios";

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
      const res = await axios.patch("/api/users/update-flags", { flag, value });
      onUserUpdate(res.data.user); // update parent state immediately
    } catch (err) {
      console.error("Failed to update flag", err);
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

