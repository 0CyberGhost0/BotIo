import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import axios from "axios";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

interface EmbedChatProps {
  botId: string;
}

const renderMessageWithBold = (content: string) => {
  const parts = content.split(/(\*\*[^*]+\*\*)/g); // Split at **text**
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

const EmbedChat = ({ botId }: EmbedChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [botName, setBotName] = useState<string>("AI Assistant");
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize chat on component mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // Fetch bot information from the embed endpoint
        const botResponse = await axios.get(`http://localhost:8000/bots/embed/${botId}`);
        const bot = botResponse.data;
        setBotName(bot.name);
        
        // Create a new anonymous chat session
        const chatResponse = await axios.post('http://localhost:8000/bots/embed/chat', { botId });
        const newChat = chatResponse.data;
        setChatId(newChat.id);
        
        // Add welcome message
        setMessages([{
          id: "welcome",
          content: `Hello! I'm ${bot.name}. How can I help you today?`,
          role: "assistant",
          createdAt: new Date().toISOString()
        }]);
      } catch (err) {
        console.error("Error initializing embedded chat:", err);
        setError("Failed to initialize chat. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [botId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || !chatId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      // Send message without auth token for embedded chat
      const response = await axios.post(
        `http://localhost:8000/bots/embed/chat/${chatId}/message`,
        { content: userMessage.content, botId }
      );

      // Add bot response
      const { botResponse } = response.data;
      
      setMessages((prev) => [
        ...prev,
        botResponse // Add bot response
      ]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full border border-gray-700 rounded-lg overflow-hidden bg-[#1f1f1f] text-white">
      <div className="p-3 border-b border-gray-700 bg-[#2a2a2a]">
        <h2 className="font-semibold flex items-center text-sm">
          <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center mr-2 text-white text-xs">
            🤖
          </div>
          {botName}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center mr-2 text-white text-xs flex-shrink-0">
                🤖
              </div>
            )}
            <div
              className={`max-w-[80%] p-2 rounded-lg ${
                message.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-200"
              }`}
            >
              <p className="text-xs">{renderMessageWithBold(message.content)}</p>
              <p className="text-right text-xs text-gray-400 mt-1">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {message.role === "user" && (
              <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center ml-2 text-white text-xs flex-shrink-0">
                👤
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center mr-2 text-white text-xs">
              🤖
            </div>
            <div className="bg-gray-800 p-2 rounded-lg">
              <div className="flex space-x-2 items-center">
                <div
                  className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-2 rounded-lg text-xs">
            {error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-700 bg-[#2a2a2a]">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="w-full border border-gray-600 rounded-full py-2 pl-3 pr-10 bg-[#1f1f1f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs"
            disabled={isLoading || !chatId}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded-full disabled:opacity-50"
            disabled={!inputValue.trim() || isLoading || !chatId}
          >
            <Send size={12} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmbedChat;