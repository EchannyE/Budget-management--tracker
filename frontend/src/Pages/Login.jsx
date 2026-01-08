import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/apiServices";
import { LockKeyhole, Loader2, Mail, Lock } from 'lucide-react'; 

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); 

        

        try {
            const data = await authService.login({ email, password });

            localStorage.setItem("token", data.token);
            localStorage.setItem("currentUser", JSON.stringify(data.user));

            console.log("Login successful! Redirecting...");
            navigate("/dashboard", { replace: true });
        } catch (err) {
            console.error("Login Error:", err);
            const errorMessage = err.response?.data?.message || "Login failed. Check your credentials.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
       
        <div className=" min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-2xl shadow-2xl border-t-4 border-indigo-600">
                <div className="flex flex-col items-center mb-8">
                    <LockKeyhole className="w-12 h-12 text-indigo-600 mb-3" />
                    <h2 className="text-3xl font-extrabold text-gray-800">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Sign in to manage your finances.</p>
                </div>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {/* Forgot Password Link */}
                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline font-medium mb-2">Forgot password?</Link>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400 flex items-center justify-center mt-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            "Login"
                        )}
                    </button>
                    <p className="text-sm text-center pt-4 text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-indigo-600 font-medium hover:text-indigo-800 transition duration-150">
                            Create Account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;