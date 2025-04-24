"use client";

import { CheckCircle, XCircle } from "lucide-react";

const PlansPage = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Try it out with basic features",
      features: [
        { name: "1 Chatbot", included: true },
        { name: "25 Responses per month", included: true },
        { name: "1 Data source", included: true },
        { name: "Basic customization", included: true },
        { name: "Email support", included: false },
        { name: "White labeling", included: false },
        { name: "API access", included: false },
        { name: "Analytics", included: false },
      ],
      highlighted: false,
      cta: "Current Plan",
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For growing businesses",
      features: [
        { name: "5 Chatbots", included: true },
        { name: "500 Responses per month", included: true },
        { name: "20 Data sources", included: true },
        { name: "Advanced customization", included: true },
        { name: "Priority email support", included: true },
        { name: "White labeling", included: true },
        { name: "API access", included: false },
        { name: "Advanced analytics", included: false },
      ],
      highlighted: true,
      cta: "Upgrade",
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For large organizations",
      features: [
        { name: "Unlimited Chatbots", included: true },
        { name: "10,000 Responses per month", included: true },
        { name: "Unlimited Data sources", included: true },
        { name: "Full customization", included: true },
        { name: "24/7 support", included: true },
        { name: "White labeling", included: true },
        { name: "API access", included: true },
        { name: "Advanced analytics", included: true },
      ],
      highlighted: false,
      cta: "Contact Sales",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-400">Subscription Plans</h1>
        <p className="text-gray-400 mt-3 text-lg">Choose the plan that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl border shadow-xl overflow-hidden transition-transform transform hover:scale-[1.02] backdrop-blur-lg ${
              plan.highlighted
                ? "bg-indigo-800 border-indigo-600"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            {plan.highlighted && (
              <div className="bg-indigo-700 text-white text-xs font-medium text-center py-2 tracking-wide">
                ⭐ MOST POPULAR
              </div>
            )}

            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-400 text-sm mb-1">/ {plan.period}</span>
              </div>
              <p className="text-gray-400 mt-4">{plan.description}</p>

              <ul className="mt-6 space-y-4 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-2">
                    {feature.included ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-500" />
                    )}
                    <span
                      className={
                        feature.included ? "text-gray-200" : "text-gray-600 line-through"
                      }
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-white text-indigo-700 hover:bg-gray-100"
                    : plan.name === "Free"
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlansPage;
