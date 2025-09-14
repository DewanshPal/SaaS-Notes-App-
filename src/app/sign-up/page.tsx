"use client"
import React, { useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const [ user ,setUser] = React.useState({
        tenantID : "",
        email: "",
        password: "",
        username : "",
        role : "MEMBER"
    });
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onSignup = async () => {
        try{
            setLoading(true);
            await axios.post('/api/signup',user);
            console.log("Signup successful");
            toast.success("Signup successful. Please login");
            router.push('/sign-in');
        }
        catch(error: unknown)
        {
            const errorMessage = error instanceof Error ? error.message : 'Signup failed';
            console.log("Signup failed", errorMessage);
            toast.error("Signup failed");

        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0){
            setButtonDisabled(false);
        }else{
            setButtonDisabled(true);
        }
    },[user]);
  return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {loading ? "Processing..." : "Create an Account"}
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Join us today and get started
        </p>

        {/* Form */}
        <div className="flex flex-col">
          <label
            htmlFor="tenantId"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Tenant ID
          </label>
          <input
            id="tenantId"
            type="text"
            value={user.tenantID}
            onChange={(e) => setUser({ ...user, tenantID: e.target.value })}
            placeholder="Enter your tenant ID"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          />
          <label
            htmlFor="username"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Enter your username"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          />

          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          />

          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          />

          <label
            htmlFor="role"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Role
          </label>
          <input
            id="role"
            type="text"
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
            placeholder="Enter ADMIN or MEMBER"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          />

          {/* Button */}
          <button
            onClick={onSignup}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
              buttonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            disabled={buttonDisabled}
          >
            {buttonDisabled ? "Please fill all fields" : "Sign Up"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-indigo-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}