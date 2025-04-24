"use client"
import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { LogOut, Settings, User } from "lucide-react";

const UserButton = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm overflow-hidden">
          {user.imageUrl ? (
            <img src={user.imageUrl} alt={user.fullName || "User"} className="w-full h-full object-cover" />
          ) : (
            user.fullName?.[0] || "U"
          )}
        </div>
        <span className="text-sm font-medium hidden md:block">{user.fullName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20">
          <div className="py-2">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
            <a
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </a>
            <a
              href="/account"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 mr-3" />
              Account
            </a>
            <button
              onClick={() => signOut()}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default UserButton;
