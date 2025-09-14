"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function UpgradeFlow({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  
  async function handleUpgrade() {
    setLoading(true);

    try {
      const res = await axios.post(`/api/tenants/${slug}/upgrade`);

      if (res.data.success) {
        toast.success(`Tenant "${slug}" upgraded successfully!`);
      } else {
        toast.error(res.data.error || "Upgrade failed.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Network error while upgrading.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 border rounded p-4">
      <h2 className="text-lg font-semibold">Upgrade Tenant Plan</h2>

      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        {loading ? "Upgrading..." : `Upgrade Tenant: ${slug}`}
      </button>
    </div>
  );
}
