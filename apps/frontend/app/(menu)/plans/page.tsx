'use client';

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
    <div className="p-6 bg-gray-900 text-white">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-100">Subscription Plans</h1>
        <p className="text-gray-400 mt-2">Choose the plan that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl overflow-hidden shadow-lg border ${
              plan.highlighted ? "bg-indigo-800 text-white" : "bg-gray-800 border-gray-700"
            } transition-all transform hover:scale-105 hover:shadow-xl`}
          >
            {plan.highlighted && (
              <div className="bg-indigo-700 text-white text-center text-sm py-1">
                MOST POPULAR
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-semibold">{plan.name}</h2>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-lg text-gray-400">/{plan.period}</span>
              </div>
              <p className="text-gray-400 mt-4">{plan.description}</p>

              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-start space-x-2">
                    {feature.included ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-500" />
                    )}
                    <span className={feature.included ? "text-gray-300" : "text-gray-600"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : plan.name === "Free"
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-indigo-500 hover:bg-indigo-600"
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
