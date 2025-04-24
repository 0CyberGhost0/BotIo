"use client"
import { useUser,useAuth} from "@clerk/nextjs";
import { useEffect } from "react";

const Dashboard = () => {
  const { user} = useUser();
  const { getToken, isSignedIn } = useAuth();
  useEffect(() => {

    async function fetchToken() {
      const token=await getToken({template:"botio"});
      console.log("User JWT token:", token);  
    }
    fetchToken();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-[#0f172a] text-white">
      <h1 className="text-3xl font-bold">Welcome back, {user?.firstName || "User"}</h1>
      <p className="text-gray-400 mt-2">Manage your chatbots and access your dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {/* My Bots Card */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 hover:shadow-lg hover:border-indigo-500 transition duration-300">
          <h2 className="text-xl font-semibold text-white">My Bots</h2>
          <p className="text-gray-400 text-sm mt-1">Manage and create AI chatbots</p>
          <button className="mt-5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 px-4 rounded-md transition">
            View all →
          </button>
        </div>

        {/* Analytics Card */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 hover:shadow-lg hover:border-indigo-500 transition duration-300">
          <h2 className="text-xl font-semibold text-white">Analytics</h2>
          <p className="text-gray-400 text-sm mt-1">View chat statistics and performance</p>
          <button className="mt-5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 px-4 rounded-md transition">
            View stats →
          </button>
        </div>

        {/* Settings Card */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 hover:shadow-lg hover:border-indigo-500 transition duration-300">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <p className="text-gray-400 text-sm mt-1">Configure your account settings</p>
          <button className="mt-5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 px-4 rounded-md transition">
            Configure →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
