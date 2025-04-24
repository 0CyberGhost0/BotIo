"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Bot } from "lucide-react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const token = await getToken({ template: "botio" });
        const res = await fetch("http://localhost:8000/bots/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch bots");

        const data = await res.json();
        setBots(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isSignedIn) fetchBots();
  }, [isSignedIn]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-400">
          Welcome back, {user?.firstName || "User"}
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Manage your chatbots and access insights
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {/* My Bots */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur hover:border-indigo-500 transition">
            <h2 className="text-xl font-semibold text-white">My Bots</h2>
            <p className="text-gray-400 text-sm mt-1">
              Manage and create AI chatbots
            </p>
            <button
              onClick={() => router.push("/bots")}
              className="mt-5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 px-4 rounded-lg transition"
            >
              View all →
            </button>
          </div>


          {/* Settings */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur hover:border-indigo-500 transition">
            <h2 className="text-xl font-semibold text-white">Settings</h2>
            <p className="text-gray-400 text-sm mt-1">
              Configure your account settings
            </p>
            <button
              onClick={() => router.push("/settings")}
              className="mt-5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 px-4 rounded-lg transition"
            >
              Configure →
            </button>
          </div> 
        </div>

        {/* Bot Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">Your Bots</h2>
          {loading ? (
            <div className="flex justify-center mt-10">
              <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent animate-spin rounded-full" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center mt-6">Error: {error}</p>
          ) : bots.length === 0 ? (
            <p className="text-gray-400 text-center mt-6">You haven't created any bots yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bots.map((bot) => (
                <div
                  key={bot.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur hover:shadow-xl hover:border-indigo-500 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-indigo-700 p-3 rounded-full">
                      <Bot className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{bot.name}</h3>
                      <p className="text-sm text-gray-400">{bot.description}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 mt-3">
                    <p>
                      <span className="font-medium text-white">Model:</span>{" "}
                      {bot.model}
                    </p>
                    <p>
                      <span className="font-medium text-white">Created:</span>{" "}
                      {new Date(bot.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium transition"
                    onClick={() => router.push(`/bots/${bot.id}`)}
                  >
                    Manage
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
