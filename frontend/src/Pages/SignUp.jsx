import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/apiServices';
// --- Lucide Icons ---
import { UserPlus, Loader2, User, Mail, Lock } from 'lucide-react'; 

const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); 

    const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(""); 

  try {
    await authService.register({ name, email, password }); // ✅ FIXED
    console.log('Signup successful! Redirecting to login.');
    navigate('/login', { replace: true });
  } catch (err) {
    console.error("Signup Error:", err);
    const errorMessage =
      err.response?.data?.message ||
      'Signup failed. Please try a stronger password or different email.';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-2xl shadow-2xl border-t-4 border-indigo-600">
                <div className="flex flex-col items-center mb-8">
                    <UserPlus className="w-12 h-12 text-indigo-600 mb-3" />
                    <h2 className="text-3xl font-extrabold text-gray-800 text-center">
                        Create Your Account
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Start tracking your budget today.</p>
                </div>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    
                    {/* Email Input */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    {/* Password Input */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Password (Min. 6 characters)"
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400 flex items-center justify-center mt-6"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                    
                    {/* Login Link */}
                    <p className="text-sm text-center pt-4 text-gray-600">
                        Already have an account?{' '}
                        <Link 
                            to="/login" 
                            className="text-indigo-600 font-medium hover:text-indigo-800 transition duration-150"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;