import React from 'react';
import { Card, Button } from 'flowbite-react';

const pricingPlans = [
  {
    name: 'Individual',
    price: '$299/Month',
    description: 'For individuals who want to understand why their landing pages aren\'t working',
    buttonText: 'SIGN UP',
    buttonClass: 'bg-white text-black hover:bg-yellow',
    bgClass: 'bg-blue-500',
  },
  {
    name: 'Company',
    price: '$999/Month',
    description: 'For mid-sized companies who are serious about boosting their revenue by 30%',
    buttonText: 'SIGN UP',
    buttonClass: 'bg-purple-500 hover:bg-purple-600',
    bgClass: 'bg-purple-500',
  },
  {
    name: 'Enterprise',
    price: '$4,999/Month',
    description: 'For large enterprises looking to outsource their conversion rate optimization',
    buttonText: 'BOOK A CALL',
    buttonClass: 'bg-pink-500 hover:bg-pink-600',
    bgClass: 'bg-pink-500',
  },
];

const Pricing = () => {
  return (
    <div className="bg-gradient-to-b from-white via-blue-100 to-white min-h-screen py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Our Pricing Plans</h1>
        <p className="text-lg text-gray-900">
          Choose a plan that fits your needs. All plans come with a 14-day free trial.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`relative w-full max-w-sm p-6 text-white rounded-lg shadow-md transform transition duration-500 hover:scale-105 ${plan.bgClass} overflow-hidden`}
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
              <p className="text-xl font-semibold mb-4">{plan.price}</p>
              <p className="mb-6">{plan.description}</p>
              <Button className={`w-full text-white ${plan.buttonClass}`}>
                {plan.buttonText}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
