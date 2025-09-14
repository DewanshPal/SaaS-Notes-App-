"use client";

interface User {
  name: string;
  email: string;
  role: string;
  isAddingMembers: boolean;
  isUpgradingPlan: boolean;
}

export default function ProfileInformation({ user }: { user: User }) {
  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <h2 className="text-lg font-bold">Profile Information</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Adding Members:</strong> {user.isAddingMembers ? "Yes" : "No"}</p>
      <p><strong>Upgrading Plan:</strong> {user.isUpgradingPlan ? "Yes" : "No"}</p>
    </div>
  );
}
