"use client";

import Link from "next/link";
import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import ChatBot from "./components/ChatBot";

const Home = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      {/* Header */}
      <header className="w-full py-6 px-6 flex items-center justify-between backdrop-blur border-b border-white/10">
        <div className="flex items-center">
          <div className="w-9 h-9 bg-indigo-600 text-white rounded-md flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-indigo-400">bot.io</span>
        </div>
        <div className="flex items-center space-x-4">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal" redirectUrl="/dashboard">
                <button className="text-gray-300 hover:text-white transition">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal" redirectUrl="/dashboard">
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition">
                  Create a Free Bot
                </button>
              </SignUpButton>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition"
            >
              Dashboard
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 lg:pr-16 mb-16 lg:mb-0">
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            <span className="text-white">The</span>
            <br />
            <span className="text-indigo-400">Most Accurate</span>
            <br />
            <span className="text-purple-400">AI Chatbot</span>
            <br />
            <span className="text-white">trained on your data.</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Say goodbye to repetitive questions. Let our GPT-4 chatbot
            <span className="font-medium text-white"> learn from your data </span>
            and handle them for you — instantly.
          </p>

          <SignUpButton mode="modal" redirectUrl="/dashboard">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg text-lg font-semibold inline-flex items-center transition">
              Create a Free Bot
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </SignUpButton>

          <p className="text-sm text-gray-500 mt-4">
            Start in under 30 seconds • 100% Free • No Coding Required
          </p>
        </div>

        <div className="lg:w-1/2">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl shadow-xl p-6">
            {/* <div className="border-b border-white/10 pb-3 mb-4">
              {/* <div className="bg-indigo-700/20 text-indigo-300 text-xs font-medium px-2 py-1 rounded">
                LIVE DEMO
              </div> */}
            {/* </div> */} 
            <ChatBot botId="iz5ede16ydb" botName="Demo Bot" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
