"use client";

import { useState } from "react";

const FeatureRequestPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "feature",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        title: "",
        description: "",
        category: "feature",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-400 mb-2">
          Submit a Feature Request
        </h1>
        <p className="text-gray-400 mb-8">
          Got an idea or found a bug? We'd love to hear it!
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur p-8 shadow-lg transition">
          {isSubmitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-600/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-green-400 mb-2">
                Thank you!
              </h2>
              <p className="text-gray-400 mb-4">
                Your request has been received.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
              >
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm mb-1 text-white/80">
                  Request Type
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-[#0f172a] text-white border border-[#334155] rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  
                  required
                >
                  <option value="feature">New Feature</option>
                  <option value="improvement">Improvement</option>
                  <option value="bug">Bug Report</option>
                  <option value="integration">Integration Request</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-white/80">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Add Slack integration"
                  className="w-full bg-white/10 border border-white/20 rounded-lg text-white p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-white/80">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your idea in detail..."
                  rows={6}
                  className="w-full bg-white/10 border border-white/20 rounded-lg text-white p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin mr-3 h-5 w-5 text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Feature Request"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureRequestPage;
