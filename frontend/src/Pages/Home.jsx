import React from 'react';

const Home = () => {
  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      
    
      <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-600 mb-4 text-center">
        Welcome to BudgetTracker
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
        Take control of your finances with BudgetTracker. Sign up today to start managing your budget, tracking expenses, and achieving your financial goals!
      </p>

      {/* Action Button */}
      <a
        href="/signup"
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg"
      >
        Get Started
      </a>

    </div>
  );
}

export default Home;