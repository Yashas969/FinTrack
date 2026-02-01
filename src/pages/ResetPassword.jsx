import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Wallet, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            // 1. Validation
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }

            const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
            if (!strongPasswordRegex.test(password)) {
                throw new Error("Password must be at least 6 characters, include one capital letter and one special character (!@#$%^&*)");
            }

            // 2. Update Password
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) throw updateError;

            // 3. Success
            setMessage("Password updated successfully");

            // 4. Redirect after delay
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            console.error("Reset password error:", err);
            // Show validation errors as is, but generic error for others (likely auth issues)
            if (err.message === "Passwords do not match" || err.message.startsWith("Password must be")) {
                setError(err.message);
            } else {
                setError("Reset link is invalid or expired. Please request a new one.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 animate-in fade-in duration-500">
            <div className="bg-zinc-900/50 p-8 rounded-2xl shadow-xl w-full max-w-md border border-zinc-800 backdrop-blur-sm">
                <div className="flex flex-col items-center mb-8">
                    <img
                        src={logo}
                        alt="FinTrack Logo"
                        className="w-12 h-12 object-contain mb-4"
                    />
                    <h1 className="text-3xl font-extrabold text-zinc-100 mb-1 tracking-tight">FinTrack</h1>
                    <p className="text-emerald-500 font-medium text-sm mb-6">Set new password</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium text-center flex items-center gap-2 justify-center">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-medium text-center flex items-center gap-2 justify-center">
                        <CheckCircle size={16} />
                        {message}
                    </div>
                )}

                {!message && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder-zinc-600"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder-zinc-600"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="text-xs text-zinc-500 mt-2 ml-1">
                            Password must be at least 6 characters, include one capital letter and one special character (!@#$%^&*)
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                'Updating...'
                            ) : (
                                <>
                                    <span>Reset Password</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
