'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

const CreateBotPage = () => {
  const router = useRouter();
  const [botName, setBotName] = useState('');
  const [botDescription, setBotDescription] = useState('');
  const [botType, setBotType] = useState<'general' | 'specialized'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = await getToken({ template: 'botio' });

      const response = await axios.post(
        'http://localhost:8000/bots/create',
        {
          name: botName,
          description: botDescription,
          type: botType,
          model: 'gpt-4o',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsLoading(false);
      router.push(`/bots/${response.data.id}`);
    } catch (error) {
      setIsLoading(false);
      console.error('Error creating bot:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-[#1e293b] border border-[#334155] rounded-2xl p-10 shadow-xl space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create a New Bot</h1>
          <p className="text-gray-400 mt-2">Fill in the details below to create your chatbot</p>
        </div>

        <div>
          <label htmlFor="botName" className="block text-sm font-medium mb-2 text-gray-300">
            Bot Name
          </label>
          <input
            type="text"
            id="botName"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="My Awesome Chatbot"
            required
          />
        </div>

        <div>
          <label htmlFor="botDescription" className="block text-sm font-medium mb-2 text-gray-300">
            Bot Description
          </label>
          <input
            type="text"
            id="botDescription"
            value={botDescription}
            onChange={(e) => setBotDescription(e.target.value)}
            className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Brief description of your bot"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Bot Type</label>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={`cursor-pointer p-4 rounded-lg border ${
                botType === 'general'
                  ? 'border-indigo-500 bg-[#0f172a]'
                  : 'border-[#334155] bg-transparent'
              }`}
              onClick={() => setBotType('general')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="botType"
                  checked={botType === 'general'}
                  onChange={() => setBotType('general')}
                  className="h-4 w-4 text-indigo-600"
                />
                <span className="ml-2 text-sm font-medium text-white">General Purpose</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">A versatile bot for general Q&amp;A</p>
            </label>

            <label
              className={`cursor-pointer p-4 rounded-lg border ${
                botType === 'specialized'
                  ? 'border-indigo-500 bg-[#0f172a]'
                  : 'border-[#334155] bg-transparent'
              }`}
              onClick={() => setBotType('specialized')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="botType"
                  checked={botType === 'specialized'}
                  onChange={() => setBotType('specialized')}
                  className="h-4 w-4 text-indigo-600"
                />
                <span className="ml-2 text-sm font-medium text-white">Specialized</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Focused on specific domains</p>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
          <select
            defaultValue="gpt-4o"
            className="w-full bg-[#0f172a] text-white border border-[#334155] rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="gpt-4o">GPT-4o (Recommended)</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="claude-3">Claude 3</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !botName}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating...
            </>
          ) : (
            'Create Bot'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateBotPage;
