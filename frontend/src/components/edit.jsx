import React from 'react';
import { Sparkles, DollarSign, Target, ArrowRight } from 'lucide-react'; // Example icons from lucide-react

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
    <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full mb-4">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- Hero Section --- */}
      <header className="py-20 md:py-32 flex flex-col items-center text-center px-4 bg-white shadow-sm">
        <Sparkles className="w-10 h-10 text-indigo-500 mb-4" />
        <h1 className="text-4xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Achieve Financial Freedom with BudgetTracker
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl">
          Take control of your finances. Our intuitive tools help you manage your budget, track every expense, and hit your saving goals with ease.
        </p>

        {/* Primary Call to Action */}
        <a
          href="/signup"
          className="group flex items-center bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 transition duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
        >
          Start Tracking Now
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </a>
      </header>

      {/* --- Features Section --- */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
          Why Choose BudgetTracker?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={DollarSign}
            title="Smarter Expense Tracking"
            description="Categorize and visualize your spending in real-time, so you always know where your money goes."
          />
          <FeatureCard
            icon={Target}
            title="Goal-Oriented Budgeting"
            description="Set practical saving goals and create budgets that actually help you achieve them, not just restrict you."
          />
          <FeatureCard
            icon={Sparkles}
            title="Simple & Intuitive UI"
            description="Enjoy a clean, easy-to-use interface designed to make managing your money feel effortless, not like a chore."
          />
        </div>
      </section>
      
      {/* --- Simple Footer/Bottom CTA --- */}
      <footer className="py-12 bg-gray-100 text-center border-t border-gray-200 mt-12">
         <p className="text-xl text-gray-700 mb-6">
            Ready to change your financial future?
         </p>
         <a
          href="/signup"
          className="bg-indigo-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-600 transition duration-200 shadow-md"
         >
           Create My Free Account
         </a>
      </footer>

    </div>
  );
}

export default Home;