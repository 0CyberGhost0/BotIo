'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Home, Bot, CreditCard, Settings, MessageSquare } from 'lucide-react';
import UserButton from '../layout/UserButton';
import { cn } from '../../../lib/utils';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

const USAGE_LIMITS = {
  responses: 25,
  bots: 1,
  sources: 50,
};

const Sidebar = () => {
  const { getToken } = useAuth();

  const [usage, setUsage] = useState({
    responsesUsed: 0,
    botCount: 0,
    sourcesCount: 0,
  });

  const pathname = usePathname();

  useEffect(() => {

  
    const fetchUsage = async () => {
      try {
        const token = await getToken();

        const res = await axios.get(`http://localhost:8000/bots/usage`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("USAGE");
        console.log(res);
  
        const data = await res.data;
        console.log(data);
        setUsage(data || {});
      } catch (err) {
        console.error('Failed to fetch usage:', err);
      }
    };

    fetchUsage();
  }, []);

  const navigationItems = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'Bots', icon: Bot, path: '/bots' },
    { name: 'Plans', icon: CreditCard, path: '/plans' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const communityItems = [
    { name: 'Feature Request', icon: MessageSquare, path: '/featureRequest' },
  ];

  const usageBars = [
    {
      label: `${usage.responsesUsed ?? 0}/${USAGE_LIMITS.responses} responses`,
      percent: Math.min(((usage.responsesUsed ?? 0) / USAGE_LIMITS.responses) * 100, 100),
    },
    {
      label: `${usage.botCount ?? 0}/${USAGE_LIMITS.bots} bot`,
      percent: Math.min(((usage.botCount ?? 0) / USAGE_LIMITS.bots) * 100, 100),
    },
    {
      label: `${usage.sourcesCount ?? 0}/${USAGE_LIMITS.sources} sources`,
      percent: Math.min(((usage.sourcesCount ?? 0) / USAGE_LIMITS.sources) * 100, 100),
    },
  ];
  const handleLiveChat = () => {
    if (!document.getElementById("e8zn9vvislg")) {
      const script = document.createElement("script");
      script.id = "e8zn9vvislg";
      script.src = "http://localhost:3000/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  };
  

  return (
    <div className="w-[240px] h-screen bg-zinc-900/80 backdrop-blur-md text-white flex flex-col border-r border-zinc-800 shadow-lg">
      {/* Brand */}
      <div className="p-6 border-b border-zinc-800">
        <Link href="/" className="flex items-center text-indigo-400 font-bold text-xl tracking-wide space-x-2">
          <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-md">
            <MessageSquare size={18} />
          </div>
          <span>bot.io</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col px-4 py-6 space-y-10 overflow-auto">
        <div className="space-y-3">
          <h2 className="text-xs uppercase text-zinc-400 font-semibold px-1">Main</h2>
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                pathname === item.path
                  ? 'bg-indigo-600 text-white shadow-inner'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white hover:pl-4'
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="text-xs uppercase text-zinc-400 font-semibold px-1">Community</h2>
          {communityItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                pathname === item.path
                  ? 'bg-indigo-600 text-white shadow-inner'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white hover:pl-4'
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="p-5 border-t border-zinc-800 space-y-6">
        <UserButton />

        <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-500 rounded-xl p-4 text-white shadow-md">
          <h3 className="text-sm font-semibold mb-1">Need help?</h3>
          <p className="text-xs text-indigo-100 mb-3">Live chat with us</p>
          <button className="w-full bg-white text-indigo-700 font-medium py-2 text-sm rounded-lg hover:bg-indigo-100 transition" onClick={handleLiveChat}>
            Ask live chat
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-zinc-200">Free Plan</h3>
          </div>

          {usageBars.map(({ label, percent }, i) => (
            <div key={i}>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-xs text-zinc-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
