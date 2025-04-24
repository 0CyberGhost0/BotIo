"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const bots = [
  {
    id: "1",
    name: "CodeBuddy",
    description: "Helps you write code and debug.",
    avatar: "/bot-avatar.png",
    model: "ChatGPT 4o",
    source: "1",
    createdAt: "2025-04-15",
  },
  {
    id: "2",
    name: "DesignGenie",
    description: "Assists with UI/UX design ideas.",
    avatar: "/bot-avatar.png",
    model: "ChatGPT 4o",
    source: "1",
    createdAt: "2025-04-12",
  },
  {
    id: "3",
    name: "MathWhiz",
    description: "Solves mathematical problems.",
    avatar: "/bot-avatar.png",
    model: "ChatGPT 4o",
    source: "1",
    createdAt: "2025-04-10",
  },
];

const BotPage = () => {
  const [botList, setBotList] = useState(bots);
  const router=useRouter();

  const handleCreateBot = () => {
    router.push("/bots/create");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-400">Your Bots</h1>
          <button
            onClick={handleCreateBot}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl text-white font-semibold transition-all"
          >
            <Plus className="w-5 h-5" />
            Create New Bot
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {botList.map((bot) => (
            <div
              key={bot.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:shadow-xl transition-all backdrop-blur"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-400">
                  <Image src={bot.avatar} alt={bot.name} fill className="object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{bot.name}</h2>
                  <p className="text-gray-400 text-sm">{bot.description}</p>
                </div>
              </div>

              <div className="text-sm text-gray-300 space-y-1 mt-2">
                <p><span className="text-white font-medium">Model:</span> {bot.model}</p>
                <p><span className="text-white font-medium">Source:</span> {bot.source}</p>
                <p><span className="text-white font-medium">Date Created:</span> {bot.createdAt}</p>
              </div>

              <button className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-medium" onClick={()=> router.push(`/bots/${bot.id}`)}>
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BotPage;
