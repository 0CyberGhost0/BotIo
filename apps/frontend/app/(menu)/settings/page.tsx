"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

const SettingsPage = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    { id: "account", label: "Account" },
    { id: "api", label: "API Keys" },
    { id: "billing", label: "Billing" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white/5 backdrop-blur-md shadow-xl border border-white/10 rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-400">Settings</h1>

        <div className="flex justify-center border-b border-gray-700 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`mx-3 pb-2 text-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "text-indigo-400 border-b-2 border-indigo-400"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            {/* --- Account Tab --- */}
            {activeTab === "account" && (
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Name</label>
                      <input
                        type="text"
                        defaultValue={user?.fullName || ""}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        disabled
                        defaultValue={user?.primaryEmailAddress?.emailAddress || ""}
                        className="w-full bg-gray-700 text-gray-400 cursor-not-allowed rounded-lg px-4 py-2 border border-gray-600"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed. Contact support for assistance.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">Password</h2>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all">
                    Change Password
                  </button>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4 text-red-400">Danger Zone</h2>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all">
                    Delete Account
                  </button>
                </section>
              </div>
            )}

            {/* --- API Keys Tab --- */}
            {activeTab === "api" && (
              <div className="space-y-10">
                <section>
                  <h2 className="text-xl font-semibold mb-2">API Keys</h2>
                  <p className="text-gray-400 mb-4">Use these keys to interact with the API. Keep them secret!</p>

                  {["Live", "Test"].map((type) => (
                    <div key={type} className="border border-gray-600 rounded-lg p-4 mb-4 bg-gray-800/40">
                      <h3 className="font-medium">{type} API Key</h3>
                      <div className="mt-2 flex items-center">
                        <input
                          type="password"
                          readOnly
                          value="••••••••••••••••••••••••••••••"
                          className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-700"
                        />
                        <button className="ml-2 text-sm px-3 py-2 border border-gray-600 rounded hover:bg-gray-700">
                          Copy
                        </button>
                        <button className="ml-2 text-sm px-3 py-2 border border-gray-600 rounded hover:bg-gray-700">
                          Reveal
                        </button>
                      </div>
                    </div>
                  ))}

                  <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all">
                    Regenerate API Keys
                  </button>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">Webhook Settings</h2>
                  <label className="block text-sm text-gray-300 mb-1">Webhook URL</label>
                  <input
                    type="url"
                    placeholder="https://yourwebsite.com/webhook"
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send POST requests to this URL when events occur.
                  </p>
                </section>
              </div>
            )}

            {/* --- Billing Tab --- */}
            {activeTab === "billing" && (
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
                  <div className="border border-gray-600 rounded-lg p-4 bg-gray-800/40">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Free Plan</h3>
                        <p className="text-gray-400 text-sm">Limited features</p>
                      </div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
                        Upgrade Plan
                      </button>
                    </div>

                    <div className="mt-4 space-y-2">
                      {[
                        { label: "2/25 responses", width: "40%" },
                        { label: "1/1 bot", width: "50%" },
                        { label: "1/50 sources", width: "10%" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full" style={{ width: item.width }}></div>
                          </div>
                          <span className="ml-3 text-gray-500 min-w-[100px]">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
                  <p className="text-gray-400 mb-4">No payment methods added yet.</p>
                  <button className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700">
                    Add Payment Method
                  </button>
                </section>
              </div>
            )}

            {/* --- Notifications Tab --- */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Email Notifications</h2>
                {[
                  {
                    title: "Bot Activity",
                    desc: "Get notified about your bot performance",
                    defaultChecked: true,
                  },
                  {
                    title: "Marketing Updates",
                    desc: "Receive news and special offers",
                    defaultChecked: false,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-600 rounded-lg bg-gray-800/40">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.defaultChecked} />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:border after:border-gray-600 after:transition-all"></div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
