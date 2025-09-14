"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterTenant() {
  const [name, setName] = useState("");
  const [subscription, setSubscription] = useState("FREE");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/tenants/register", {
        name,
        subscription,
      });

      if (response.data.success) {
        toast.success("Tenant registered successfully!");
        router.push("/sign-up");
      } else {
        toast.error(response.data.error || "Registration failed");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Register Tenant</h1>

        {/* Tenant Name */}
        <div>
          <label className="block mb-1 font-medium">Tenant Name</label>
          <input
            type="text"
            placeholder="Enter tenant name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Subscription Plan */}
        <div>
          <label className="block mb-1 font-medium">Subscription Plan</label>
          <select
            value={subscription}
            onChange={(e) => setSubscription(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="FREE">FREE</option>
            <option value="PRO">PRO</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register Tenant"}
        </button>
      </form>
    </div>
  );
}
