import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen py-16 px-4 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 text-center">About Budget Management Tracker</h1>
        <p className="text-lg text-gray-700 mb-4 text-center">
          <span className="font-semibold">Budget Management Tracker</span> is your all-in-one solution for taking control of your finances. Our mission is to empower individuals and families to manage their money with confidence, clarity, and ease.
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-6">
          <li>Track your expenses and income in real-time</li>
          <li>Set and monitor personalized budgets and savings goals</li>
          <li>Visualize your financial trends with intuitive charts</li>
          <li>Enjoy a clean, user-friendly interface designed for everyone</li>
          <li>Access your dashboard securely from any device</li>
        </ul>
        <p className="text-gray-600 mb-2">
          Whether you're saving for a big goal, trying to reduce debt, or simply want to understand your spending habits, Budget Management Tracker is here to help you every step of the way.
        </p>
        <p className="text-gray-500 text-sm text-center mt-8">
          &copy; {new Date().getFullYear()} Budget Management Tracker. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default About;
