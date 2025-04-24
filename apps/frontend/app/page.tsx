"use client";

import Link from "next/link";

import {useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";

import ChatBot from "./components/ChatBot";
const Home = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="w-full py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-600 text-white rounded-md flex items-center justify-center mr-2">
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
          <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            bot.io
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal" redirectUrl="/dashboard">
  <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
    Sign In
  </button>
</SignInButton>
<SignUpButton mode="modal" redirectUrl="/dashboard">
  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
    Create a Free Bot
  </button>
</SignUpButton>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Dashboard
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            <span className="text-gray-900 dark:text-white">The</span>
            <br />
            <span className="text-indigo-600 dark:text-indigo-400">Most Accurate</span>
            <br />
            <span className="text-purple-600 dark:text-purple-400">AI Chatbot</span>
            <br />
            <span className="text-gray-900 dark:text-white">trained on your data.</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            No more precious time wasted answering{" "}
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              repetitive questions
            </span>
            , let our GPT-4 chatbot{" "}
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              learn from your data
            </span>
            , and handle it for you.
          </p>
          <SignUpButton mode="modal" redirecturl="/dashboard">
  <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center">
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
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Get started in &lt; 30 seconds • Try 100% free • No Coding Required
          </p>
        </div>
        <div className="lg:w-1/2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
            <div className="border-b border-gray-100 dark:border-gray-700 pb-2 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-2 py-1 rounded inline-block">
                REAL CHATBOT RESPONSES!
              </div>
            </div>
            <ChatBot botId="initial" botName="Demo Bot" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
