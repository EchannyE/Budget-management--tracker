import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { authService } from "../services/apiServices";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset email. Try again later."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-indigo-600">
        <div className="flex flex-col items-center mb-8">
          <Mail className="w-12 h-12 text-indigo-600 mb-3" />
          <h2 className="text-2xl font-extrabold text-gray-800">
            Forgot Password?
          </h2>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-sm text-center">
            If an account exists, a reset link has been sent to your email.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">
              Send Reset Link
            </button>

            <p className="text-sm text-center pt-4 text-gray-600">
              <Link to="/login" className="text-indigo-600 font-medium">
                Back to Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
