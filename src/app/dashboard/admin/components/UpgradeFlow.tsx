"use client";

import { useState } from "react";
import axios from "axios";

export default function UpgradeFlow({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpgrade() {
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`/api/tenants/${slug}/upgrade`);

      if (res.data.success) {
        setMessage(`Tenant "${slug}" upgraded successfully!`);
      } else {
        setMessage(res.data.error || "Upgrade failed.");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Network error while upgrading.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 border rounded p-4">
      <h2 className="text-lg font-semibold">Upgrade Tenant Plan</h2>

      {/* Upgrade button */}
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        {loading ? "Upgrading..." : `Upgrade Tenant: ${slug}`}
      </button>

      {/* Message */}
      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
}
