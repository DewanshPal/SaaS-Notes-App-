"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function UpgradeFlow({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpgrade() {
    setLoading(true);

    try {
      const res = await axios.post(`/api/tenants/${slug}/upgrade`);

      if (res.data.success) {
        setMessage("Tenant upgraded successfully!");
        toast.success("Tenant upgraded successfully!");
      } else {
        setMessage(res.data.error || "Upgrade failed.");
        toast.error(res.data.error || "Upgrade failed.");
      }
    } catch {
      setMessage("Network error while upgrading.");
      toast.error("Network error while upgrading.");
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
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
