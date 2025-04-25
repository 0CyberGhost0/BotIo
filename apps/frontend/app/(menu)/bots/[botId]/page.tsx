"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Database, Calendar, Code, BarChart4 } from "lucide-react";
import ChatBot from "../../../components/ChatBot";
import { useAuth } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TABS = [
  { id: "data", name: "Data", icon: <Database className="w-4 h-4" /> },
  { id: "playground", name: "Playground", icon: <Code className="w-4 h-4" /> },
  { id: "embed", name: "Embed", icon: <Code className="w-4 h-4" /> },
  { id: "history", name: "Chat History", icon: <Calendar className="w-4 h-4" /> },
  { id: "analytics", name: "Analytics", icon: <BarChart4 className="w-4 h-4" /> },
];

const DATA_SOURCES = [
  { id: "url", name: "URL", emoji: "🌐", sourceType: "url" },
  { id: "pdf", name: ".pdf", emoji: "📄", sourceType: "pdf" },
  { id: "txt", name: ".txt", emoji: "📝", sourceType: "txt" },
  { id: "text", name: "Text", emoji: "🔤", sourceType: "text" },
  // { id: "notion", name: "Notion", emoji: "📓", sourceType: "notion" },
  { id: "docs", name: "Docs", emoji: "📰", sourceType: "docs" },
  { id: "youtube", name: "Youtube", emoji: "📺", sourceType: "youtube" },
];

const getDialogDescription = (type: string) => {
  switch (type) {
    case "url":
      return "Enter the URL to fetch data from the web.";
    case "pdf":
      return "Upload a .pdf file to extract content.";
    case "txt":
      return "Upload a .txt file containing text.";
    case "text":
      return "Paste any text you want to train the bot with.";
    case "youtube":
      return "Enter a YouTube video URL";
    case "notion":
      return "Enter a Notion page URL";
    case "docs":
      return "Upload a .docx file to extract content.";
    default:
      return "Provide data to train your chatbot.";
  }
};

const renderDialogContent = (type: string, onChange: (value: any) => void) => {
  switch (type) {
    case "url":
      return (
        <input
          type="url"
          placeholder="https://example.com"
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 mt-2 rounded bg-gray-800 text-white border border-gray-600"
        />
      );
    case "pdf":
    case "txt":
    case "docs":
      return (
        <input
          type="file"
          accept={type === "pdf" ? ".pdf" : type === "txt" ? ".txt" : ".docx"}
          onChange={(e) => onChange(e.target.files?.[0])}
          className="w-full p-2 mt-2 rounded bg-gray-800 text-white border border-gray-600"
        />
      );
    case "text":
      return (
        <textarea
          placeholder="Paste your training text here..."
          rows={6}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 mt-2 rounded bg-gray-800 text-white border border-gray-600"
        />
      );
    case "youtube":
      return (
        <input
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 mt-2 rounded bg-gray-800 text-white border border-gray-600"
        />
      );
    case "notion":
      return (
        <input
          type="url"
          placeholder="https://www.notion.so/..."
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 mt-2 rounded bg-gray-800 text-white border border-gray-600"
        />
      );
    default:
      return <div>Unsupported data source</div>;
  }
};

const BotDetail = () => {
  const { botId } = useParams();

  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState("data");
  const [bot, setBot] = useState<any>(null);
  const [dataSources, setDataSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<any>(null); // Store input from dialog
  const [embedOption,setEmbedOption]=useState("iframe");

  useEffect(() => {
    const initialize = async () => {
      const userToken = await getToken();

      if (botId && userToken) {
        try {
          const res = await axios.get(`http://localhost:8000/bots/${botId}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          });

          
          setBot(res.data);
          console.log("DATA SOURCE", res.data.sources);

          // Transform the sources data to include status and other UI properties
          const formattedSources = (res.data.sources || []).map(source => {
            // Find the corresponding emoji for the source type
            const sourceConfig = DATA_SOURCES.find(s => s.id === source.type);

            return {
              ...source,
              status: "Completed", // Set default status to "Completed" for existing sources
              emoji: sourceConfig?.emoji || "📄",
              lastUpdated: source.updatedAt || new Date().toISOString(),
              url: source.content // Use content as URL for display purposes
            };
          });

          setDataSources(formattedSources);
          console.log("FORMATTED SOURCE");
          console.log(formattedSources);
        } catch (error) {
          console.error("Failed to fetch bot:", error);
        }
      }
    };
    initialize();
  }, [botId]);

  const handleTrainBot = async (sourceType: string) => {
    const userToken = await getToken();
    if (!inputValue) {
      alert("Please provide a valid input.");
      return;
    }
  
    // Generate a title
    let title = "Untitled";
    if (typeof inputValue === "string") {
      if (sourceType === "url" || sourceType === "youtube" || sourceType === "notion") {
        try {
          const url = new URL(inputValue);
          title = url.hostname + url.pathname.split("/").pop()?.replace(/[-_]/g, " ") || "Untitled";
        } catch {
          title = "Untitled";
        }
      } else if (sourceType === "text") {
        title = inputValue.substring(0, 30) + (inputValue.length > 30 ? "..." : "");
      }
    } else if (inputValue?.name) {
      title = inputValue.name.replace(/\.[^/.]+$/, ""); // Strip file extension
    }
  
    // Create a new data source entry for UI
    const newSource = {
      type: sourceType,
      url: typeof inputValue === "string" ? inputValue : inputValue?.name || "File",
      status: "Pending",
      emoji: DATA_SOURCES.find((s) => s.id === sourceType)?.emoji || "📄",
      lastUpdated: new Date().toISOString(),
    };
  
    setDataSources((prev) => [newSource, ...prev]);
    setSelectedSource(null);
    setInputValue(null);
  
    try {
      let response;
  
      if (["pdf", "txt", "docs"].includes(sourceType)) {
        const formData = new FormData();
        formData.append("file", inputValue);
        formData.append("type", sourceType);
        formData.append("title", title);
  
        response = await axios.post(`http://localhost:8000/bots/train/${botId}`, formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axios.post(
          `http://localhost:8000/bots/train/${botId}`,
          {
            type: sourceType,
            content: inputValue,
            title,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
  
      setDataSources((prev) =>
        prev.map((source) =>
          source === newSource
            ? {
                ...source,
                status: "Completed",
                lastUpdated: new Date().toISOString(),
                id: response.data.id,
              }
            : source
        )
      );
    } catch (error) {
      console.error("Failed to train bot:", error);
      setDataSources((prev) =>
        prev.map((source) =>
          source === newSource
            ? { ...source, status: "Failed", lastUpdated: new Date().toISOString() }
            : source
        )
      );
    }
  };

  if (!bot) return <div className="p-6 text-gray-400">Loading bot data...</div>;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-black via-[#0f0f0f] to-black min-h-screen text-white">
      <h1 className="text-3xl font-bold text-indigo-400">{bot.name}</h1>
  
      {/* Tab Switcher */}
      <div className="flex space-x-3 overflow-x-auto mb-8 border-b border-gray-700 pb-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {tab.icon}
            <span className="ml-2">{tab.name}</span>
          </button>
        ))}
      </div>
  
      {activeTab === "data" && (
  <section className="m-10">
    {/* Heading */}
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-1 text-white">Train your bot with knowledge</h2>
      <p className="text-gray-400 text-sm">Choose a data source to add and teach your bot.</p>
    </div>

    {/* Data Sources Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
      {DATA_SOURCES.map((source) => (
        <Dialog
          key={source.id}
          open={selectedSource === source.id}
          onOpenChange={(open) => {
            setSelectedSource(open ? source.id : null);
            setInputValue(null);
          }}
        >
          <DialogTrigger asChild>
            <button className="flex flex-col items-center justify-center p-4 border border-gray-700 bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-md">
              <div className="text-2xl mb-2">{source.emoji}</div>
              <span className="text-sm font-medium text-white">{source.name}</span>
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#111] border border-gray-700 text-white rounded-xl p-6 space-y-6 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Upload via {source.name}
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-sm">
                {getDialogDescription(source.id)}
              </DialogDescription>
            </DialogHeader>

            <div>{renderDialogContent(source.id, setInputValue)}</div>

            <button
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow transition-all"
              onClick={() => handleTrainBot(source.id)}
            >
              🚀 Train Bot
            </button>
          </DialogContent>
        </Dialog>
      ))}
    </div>

    {/* Data Source Table */}
    <div className="mt-10">
      <h3 className="text-md font-semibold text-white mb-3">Current Data Sources</h3>
      <div className="overflow-auto rounded-xl border border-gray-700 bg-gray-900 shadow-lg">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 font-semibold text-gray-200">Type</th>
              <th className="p-3 font-semibold text-gray-200">Title</th>
              <th className="p-3 font-semibold text-gray-200">Status</th>
              <th className="p-3 font-semibold text-gray-200">Message</th>
              <th className="p-3 font-semibold text-gray-200">Updated</th>
              <th className="p-3 text-right font-semibold text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataSources.length > 0 ? (
              dataSources.map((source, idx) => (
                <tr key={source.id || idx} className="border-b border-gray-800 hover:bg-gray-700 transition-all">
                  <td className="p-3">{source.emoji || "📄"} {source.type}</td>
                  <td className="p-3">{source.title}</td>
                  <td className="p-3">
                    <div className={`w-20 h-2 rounded-full ${
                      source.status === "Pending"
                        ? "bg-yellow-500"
                        : source.status === "Completed"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`} />
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      source.status === "Pending"
                        ? "bg-yellow-900 text-yellow-300"
                        : source.status === "Completed"
                        ? "bg-green-900 text-green-300"
                        : "bg-red-900 text-red-300"
                    }`}>
                      {source.status || "Completed"}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400">
                    {new Date(source.lastUpdated).toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-gray-400">
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium">
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No data sources found. Add one to begin training your bot.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </section>
)}


  

{activeTab === "playground" && (
  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {/* Preview Section */}
    <div className="p-6 border border-gray-700 bg-gradient-to-br from-gray-900 via-black to-gray-950 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-indigo-400">Live Preview</h2>
      <div className="bg-black/50 border border-gray-800 rounded-xl p-4 h-[630px] overflow-hidden place-self-center ">
        <ChatBot botId={botId as string} initialChatId="" />
      </div>
    </div>

    {/* Customization Section */}
    <div className="p-6 border border-gray-700 bg-gradient-to-br from-gray-900 via-black to-gray-950 rounded-2xl shadow-md space-y-6">
      <h2 className="text-xl font-semibold text-indigo-400">Customize Your Bot</h2>

      {["Name & Description", "Instructions to AI", "Chat Appearance"].map((section) => (
        <div
          key={section}
          className="flex justify-between items-center p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition cursor-pointer border border-gray-700"
        >
          <h3 className="text-sm sm:text-base font-medium">{section}</h3>
          <button className="text-gray-400 hover:text-white transition">
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
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  </section>
)}

{activeTab === "embed" && (
  <section className="space-y-8">
    <div className="p-8 border border-gray-700 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-white">Embed Your Bot on Your Website</h2>
      <p className="text-gray-400 mb-6">Choose a method to integrate your chatbot into your website, either using an iframe or a chat bubble script.</p>
      
      <div className="flex mb-8 border-b border-gray-700">
        <button 
          className={`px-6 py-3 font-medium ${embedOption === 'iframe' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-gray-400'}`}
          onClick={() => setEmbedOption('iframe')}
        >
          Option 1: Embed Bot 
        </button>
        <button 
          className={`px-6 py-3 font-medium ${embedOption === 'script' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-gray-400'}`}
          onClick={() => setEmbedOption('script')}
        >
          Option 2: Chat Bubble
        </button>
      </div>
      
      {embedOption === 'iframe' ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">HTML Embed Code</span>
            <button
              onClick={() => {
                const code = `<iframe
                src="http://localhost:3000/embed/${botId}" 
                width="400" 
                height="60099" 
                />
              `;
                navigator.clipboard.writeText(code);
                // toast.success("Code copied to clipboard!");
              }}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
            >
              Copy Code
            </button>
          </div>
          <pre className="bg-[#1a1a1a] p-4 rounded-lg overflow-x-auto text-sm text-gray-300">
            {
            `<iframe
  src="http://localhost:3000/embed/${botId}"
  width="400" 
  height="600"
 />
`}
          </pre>
        </div>
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">JavaScript Embed Code (Chat Bubble)</span>
            <button
              onClick={() => {
                const code = `<script id="${botId}" src="http://localhost:3000/embed.js" > </script>`;
                navigator.clipboard.writeText(code);
                toast.success("Code copied to clipboard!");
              }}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
            >
              Copy Code
            </button>
          </div>
          <pre className="bg-[#1a1a1a] p-4 rounded-lg overflow-x-auto text-sm text-gray-300">
            {`<script id="${botId}" src="http://localhost:3000/embed.js" ></script>`}
          </pre>
          <div className="mt-6 p-4 bg-gray-700 rounded-lg text-sm text-gray-300 border-l-4 border-indigo-500">
            <span className="font-semibold block mb-2">Script Parameters:</span>
            <ul className="list-disc list-inside space-y-2">
              <li><code className="bg-gray-800 px-2 rounded">id</code> - Your bot ID (required)</li>
              <li><code className="bg-gray-800 px-2 rounded">open</code> - Set to "true" to auto open the chat (default: false)</li>
              <li><code className="bg-gray-800 px-2 rounded">openDelay</code> - Millisecond delay before auto-opening the chat (default: 0)</li>
            </ul>
          </div>
        </div>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-8 border border-gray-700 bg-gray-900 rounded-lg">
        <h2 className="text-lg font-semibold mb-6 text-white">Preview</h2>
        {embedOption === 'iframe' ? (
          <div className="border border-gray-700 rounded-lg overflow-hidden place-self-center h-[630px]">
            <ChatBot botId={botId as string} botName={bot.name} />
          </div>
        ) : (
          <div className="border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center" style={{ height: "500px" }}>
            <div className="text-center">
              <div className="mb-6 bg-gray-800 p-6 rounded-full inline-flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-4">Chat Bubble Preview</h3>
              <p className="text-gray-400 mb-4">The chat bubble will appear in the bottom-right corner of your website.</p>
              <div className="bg-gray-800 px-4 py-3 rounded-lg text-sm text-gray-300 mb-4">
                Need help? Chat with me!
              </div>
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border border-gray-700 bg-gray-900 rounded-lg space-y-6">
        <h2 className="text-lg font-semibold mb-6 text-white">Integration Tips</h2>
        
        <div className="p-6 border border-gray-700 rounded-lg bg-gray-800">
          <h3 className="text-md font-medium mb-4 text-indigo-400">Where to Add the Code</h3>
          <p className="text-gray-300 text-sm">
            {embedOption === 'iframe' 
              ? "Place the iframe code where you want the chat window to appear on your page."
              : "Place the script tag at the bottom of the HTML body for optimal performance."}
          </p>
        </div>
        
        <div className="p-6 border border-gray-700 rounded-lg bg-gray-800">
          <h3 className="text-md font-medium mb-4 text-indigo-400">Best Practices</h3>
          <ul className="text-gray-300 text-sm space-y-4">
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">•</span> Test for responsiveness across devices
            </li>
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">•</span> {embedOption === 'iframe' ? "Adjust iframe dimensions for different screen sizes" : "The chat bubble automatically adjusts to various screen sizes"}
            </li>
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">•</span> {embedOption === 'iframe' ? "Add accessibility features like title and aria attributes" : "Ensure the chat bubble doesn’t interfere with key elements of your page"}
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <a href="https://docs.botio.com/integration" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Read Full Integration Documentation
          </a>
        </div>
      </div>
    </div>
  </section>
)}

{activeTab === "history" && (
  <section className="space-y-6">
    <div className="bg-yellow-100 bg-opacity-30 text-black border border-yellow-400 rounded-md p-4 text-sm">
      ⚠️ This is dummy data for display purposes only.
    </div>
    
    <div className="p-6 border border-gray-700 bg-gray-900 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Chat History</h2>
        <div className="flex space-x-3">
          <select className="bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>All time</option>
          </select>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm shadow-md transition duration-200">
            Export
          </button>
        </div>
      </div>

      <div className="overflow-auto border border-gray-700 rounded-lg bg-gray-800 shadow-md">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 font-semibold">User</th>
              <th className="p-3 font-semibold">First Message</th>
              <th className="p-3 font-semibold">Messages</th>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Duration</th>
              <th className="p-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 1, user: "Anonymous User", firstMsg: "How do I reset my password?", messages: 6, date: "Apr 22, 2025", time: "10:23 AM", duration: "4m 12s" },
              { id: 2, user: "john@example.com", firstMsg: "Can you help me with product setup?", messages: 12, date: "Apr 21, 2025", time: "3:45 PM", duration: "8m 30s" },
              { id: 3, user: "Anonymous User", firstMsg: "What are your business hours?", messages: 3, date: "Apr 21, 2025", time: "11:17 AM", duration: "1m 45s" },
              { id: 4, user: "sarah@company.co", firstMsg: "I need help with my order #45392", messages: 9, date: "Apr 20, 2025", time: "2:30 PM", duration: "6m 22s" },
              { id: 5, user: "Anonymous User", firstMsg: "Do you ship internationally?", messages: 4, date: "Apr 19, 2025", time: "9:15 AM", duration: "2m 05s" },
              { id: 6, user: "mike@test.org", firstMsg: "Is there a free trial available?", messages: 7, date: "Apr 18, 2025", time: "5:48 PM", duration: "5m 33s" },
              { id: 7, user: "Anonymous User", firstMsg: "How do I cancel my subscription?", messages: 5, date: "Apr 17, 2025", time: "4:12 PM", duration: "3m 19s" }
            ].map((chat) => (
              <tr key={chat.id} className="border-b border-gray-700 hover:bg-gray-700 transition duration-200">
                <td className="p-3 font-medium">{chat.user}</td>
                <td className="p-3">{chat.firstMsg}</td>
                <td className="p-3">{chat.messages}</td>
                <td className="p-3 text-gray-400">{chat.date} at {chat.time}</td>
                <td className="p-3">{chat.duration}</td>
                <td className="p-3 text-right">
                  <button className="text-indigo-400 hover:text-indigo-300 font-medium">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
        <div>Showing 7 of 125 conversations</div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-700 rounded-md hover:bg-gray-700 transition duration-200">Previous</button>
          <button className="px-3 py-1 bg-gray-700 rounded-md text-white">1</button>
          <button className="px-3 py-1 border border-gray-700 rounded-md hover:bg-gray-700 transition duration-200">2</button>
          <button className="px-3 py-1 border border-gray-700 rounded-md hover:bg-gray-700 transition duration-200">3</button>
          <button className="px-3 py-1 border border-gray-700 rounded-md hover:bg-gray-700 transition duration-200">Next</button>
        </div>
      </div>
    </div>
  </section>
)}


      {activeTab === "analytics" && (
        <section className="space-y-6">
          <div className="bg-yellow-100 bg-opacity-30 text-black border border-yellow-400 rounded-md p-4 text-sm">
            ⚠️ This is dummy data for display purposes only.
          </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
            <div className="flex space-x-3">
              <select className="bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-1 text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>All time</option>
              </select>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: "Total Conversations", value: "1,245", change: "+12%", icon: "💬" },
              { title: "Avg. Satisfaction", value: "4.7/5", change: "+0.3", icon: "⭐" },
              { title: "Avg. Response Time", value: "1.2s", change: "-0.3s", icon: "⚡" },
              { title: "Resolution Rate", value: "86%", change: "+4%", icon: "✅" }
            ].map((card, idx) => (
              <div key={idx} className="p-5 border border-gray-700 bg-gray-900 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{card.title}</p>
                    <p className="text-2xl font-bold mt-1">{card.value}</p>
                    <p className={`text-sm mt-1 ${card.change.includes('-') ? 'text-red-400' : 'text-green-400'}`}>
                      {card.change} from previous period
                    </p>
                  </div>
                  <div className="text-2xl">{card.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Messages Over Time Chart */}
            <div className="p-5 border border-gray-700 bg-gray-900 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Daily Conversations</h3>
              <div className="h-64 flex items-end space-x-2">
                {[35, 42, 58, 46, 72, 65, 60].map((value, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="bg-indigo-600 rounded-t w-full"
                      style={{ height: `${value}%` }}
                    ></div>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(Date.now() - (6 - idx) * 86400000).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Questions Pie Chart */}
            <div className="p-5 border border-gray-700 bg-gray-900 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Top Questions</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="relative w-40 h-40">
                  {/* Simplified pie chart */}
                  <div className="absolute inset-0 rounded-full border-8 border-indigo-600" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 50%, 0 100%)' }}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-purple-500" style={{ clipPath: 'polygon(50% 50%, 0 0, 50% 0, 100% 0, 100% 50%)' }}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0 100%)' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white font-medium">100%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
                  <span className="text-sm">Pricing (35%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm">Setup (25%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm">Features (22%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Support (18%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Topics and Sessions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Popular Topics */}
            <div className="p-5 border border-gray-700 bg-gray-900 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Popular Topics</h3>
              <div className="space-y-3">
                {[
                  { topic: "Password Reset", count: 163, percentage: 75 },
                  { topic: "Account Setup", count: 124, percentage: 60 },
                  { topic: "Billing Issues", count: 98, percentage: 45 },
                  { topic: "Feature Requests", count: 87, percentage: 40 },
                  { topic: "Troubleshooting", count: 76, percentage: 35 }
                ].map((topic, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{topic.topic}</span>
                      <span className="text-gray-400">{topic.count} conversations</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${topic.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="p-5 border border-gray-700 bg-gray-900 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Recent Feedback</h3>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {[
                  { user: "john@example.com", rating: 5, comment: "The bot answered all my questions perfectly!", time: "2 hours ago" },
                  { user: "Anonymous User", rating: 4, comment: "Very helpful but took a few tries to understand my question.", time: "5 hours ago" },
                  { user: "sarah@company.co", rating: 5, comment: "Saved me so much time! Love the quick responses.", time: "Yesterday" },
                  { user: "Anonymous User", rating: 3, comment: "Got my answer but had to rephrase my question several times.", time: "2 days ago" },
                  { user: "mike@test.org", rating: 5, comment: "Incredible! It's like talking to a real person!", time: "3 days ago" }
                ].map((feedback, idx) => (
                  <div key={idx} className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{feedback.user}</div>
                        <div className="text-sm text-gray-400">{feedback.time}</div>
                      </div>
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <span key={i} className={`text-sm ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mt-2">{feedback.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BotDetail;