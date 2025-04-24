"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bot, Plus } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

const BotPage = () => {
  const [botList, setBotList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchBots = async () => {
      const token = await getToken();

      try {
        const response = await fetch("http://localhost:8000/bots/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch bots");

        const data = await response.json();
        setBotList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, []);

  const handleCreateBot = () => router.push("/bots/create");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-gradient-to-br from-gray-900 via-black to-gray-950">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-indigo-400">Your Bots</h1>
          <button
            onClick={handleCreateBot}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Bot
          </button>
        </div>

        {botList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="text-2xl font-medium mb-3 text-gray-400">No bots yet</div>
            <p className="text-gray-500 mb-6">You haven’t created any bots yet. Let’s change that!</p>
            <button
              onClick={handleCreateBot}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-indigo-800 transition"
            >
              <Plus className="w-5 h-5" />
              Create Your First Bot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {botList.map((bot) => (
              <div
                key={bot.id}
                className="group bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-indigo-700/50 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-indigo-600 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <Bot className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{bot.name}</h2>
                    <p className="text-gray-400 text-sm line-clamp-2">{bot.description}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-300 space-y-1 mt-3">
                  <p>
                    <span className="text-white font-medium">Model:</span> {bot.model}
                  </p>
                  <p>
                    <span className="text-white font-medium">Created:</span>{" "}
                    {new Date(bot.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-medium transition-all shadow-md"
                  onClick={() => router.push(`/bots/${bot.id}`)}
                >
                  Manage Bot
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BotPage;
