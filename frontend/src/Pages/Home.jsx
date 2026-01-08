import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, DollarSign, Target, CheckCircle, Shield, TrendingUp } from 'lucide-react';

// --- Components ---


const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-1"
  >
    <div className="flex items-center justify-center w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full mb-5">
      <Icon className="w-7 h-7" strokeWidth={2} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);


const CTAButton = ({ to, text, primary = true }) => (
  <Link
    to={to}
    className={`px-8 py-3 font-semibold rounded-full text-center whitespace-nowrap transition-all duration-300 transform hover:scale-[1.03] ${
      primary
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 hover:bg-indigo-700'
        : 'bg-transparent border-2 border-indigo-400 text-indigo-200 hover:bg-indigo-400 hover:text-white'
    }`}
  >
    {text}
  </Link>
);

// --- Main Page Component ---

const Home = () => {
  return (
    <div className="min-h-screen font-sans antialiased shadow-lg text-gray-900">
      
      {/* 1. Hero Section: The most prominent part */}
      <section className="relative pt-16 pb-32 overflow-hidden">
        {/* Background/Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br ">
          <img 
            src="/img/hero-finance.png" 
            alt="Budget management hero illustration" 
            className="w-full h-full object-cover opacity-60" 
          />
        </div>
        <div className="absolute inset-0 z-10 bg-black/40"></div>
        
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-20 container mx-auto px-4 text-center max-w-4xl"
        >
          {/* Tagline/Pre-heading */}
          <span className="inline-flex items-center px-4 py-1 mb-6 text-sm font-medium text-indigo-200 bg-indigo-700/50 rounded-full border border-indigo-600 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
            <Sparkles className="w-4 h-4 mr-2" />
            Budget Management Tracker
          </span>
          
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)]">
            Set Budget, <span className="text-indigo-300">Start Tracking</span>.
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-10 text-indigo-200/90 font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
            Effortlessly monitor and control your financial life with smart Budget tracker and Manage your money, confidently.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton to="/signup" text="Start Your Free Trial" primary={true} />
            <CTAButton to="/about" text="Learn More" primary={false} />
          </div>
        </motion.div>
      </section>
      
      {/* 3. Original Features Section (Refined) */}
      <section className="py-20 md:py-28 border border-gray-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                     A Simpler Way to Budget
                </h2>
                <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                    BudgetTracker integrates intelligence into every step of your financial journey.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                <FeatureCard
                    icon={DollarSign}
                    title="Smarter Expense Tracking"
                    description="Categorize and visualize your spending in real-time with beautiful charts, so you always know where your money goes."
                />
                <FeatureCard
                    icon={Target}
                    title="Goal-Oriented Budgeting"
                    description="Set practical saving goals and create flexible budgets that help you achieve them, not just restrict your life."
                />
                <FeatureCard
                    icon={Sparkles}
                    title="Simple & Intuitive UI"
                    description="Enjoy a clean, easy-to-use interface designed to make managing your money feel effortless and enjoyable."
                />
            </div>
          </div>
      </section>

      {/* 4. Final Call-to-Action Footer Section */}
      <footer className="py-16 md:py-24 bg-indigo-600">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Ready to change your financial future?
          </h2>
          <p className="text-xl text-indigo-200 mb-10">
            Join thousands of users who are taking control of their money today. It only takes 30 seconds to sign up.
          </p>
          <CTAButton to="/signup" text="Create My Free Account" primary={false} />
          <p className="mt-4 text-sm text-indigo-300">No credit card required.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;