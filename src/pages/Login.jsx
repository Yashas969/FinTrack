import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, ArrowRight, Mail, Lock, UserPlus, LogIn, Clock, X } from 'lucide-react';

import logo from '../assets/logo.png';

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('Not Specified');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recentEmails, setRecentEmails] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const { login, signUp } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('fintrack_recent_emails');
        if (stored) {
            setRecentEmails(JSON.parse(stored));
        }
    }, []);

    const saveEmailToHistory = (emailToSave) => {
        let recents = [...recentEmails];
        recents = recents.filter(e => e !== emailToSave);
        recents.unshift(emailToSave);
        recents = recents.slice(0, 5);
        localStorage.setItem('fintrack_recent_emails', JSON.stringify(recents));
        setRecentEmails(recents);
    };

    const handleEmailSelect = (selectedEmail) => {
        setEmail(selectedEmail);
        setShowSuggestions(false);
    };

    const removeEmailFromHistory = (e, emailToRemove) => {
        e.stopPropagation();
        const updated = recentEmails.filter(email => email !== emailToRemove);
        setRecentEmails(updated);
        localStorage.setItem('fintrack_recent_emails', JSON.stringify(updated));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isSignUp) {
                const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
                if (!strongPasswordRegex.test(password)) {
                    setError("Password must be at least 6 characters, include one capital letter and one special character (!@#$%^&*)");
                    setIsLoading(false);
                    return;
                }
                await signUp(email, password, { name, dob, gender });
                saveEmailToHistory(email);
                navigate('/home');
            } else {
                await login(email, password);
                saveEmailToHistory(email);
                navigate('/home');
            }
        } catch (err) {
            setError(err.message);
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
                    <p className="text-emerald-500 font-medium text-sm mb-6">Personal finance made simple</p>

                    <div className="text-center">
                        <h2 className="text-xl font-bold text-zinc-200">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                        <p className="text-zinc-400 mt-1 text-sm">
                            {isSignUp ? 'Start managing your finances today' : 'Sign in to access your wallet'}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isSignUp && (
                        <div className="space-y-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder-zinc-600"
                                    placeholder="Enter your Name"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all [color-scheme:dark]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Gender</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all appearance-none"
                                    >
                                        <option value="Not Specified">Not Specified</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="relative">
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder-zinc-600"
                                placeholder="name@example.com"
                                required
                                autoComplete="off"
                            />
                        </div>

                        {/* Recent Email Suggestions */}
                        {showSuggestions && !isSignUp && recentEmails.length > 0 && !email && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-700 flex items-center gap-2">
                                    <Clock size={12} />
                                    Recent Logins
                                </div>
                                {recentEmails.map((recentEmail) => (
                                    <div
                                        key={recentEmail}
                                        onClick={() => handleEmailSelect(recentEmail)}
                                        className="px-4 py-3 text-zinc-300 hover:bg-zinc-700 cursor-pointer flex items-center justify-between group transition-colors"
                                    >
                                        <span className="truncate">{recentEmail}</span>
                                        <button
                                            onClick={(e) => removeEmailFromHistory(e, recentEmail)}
                                            className="text-zinc-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                            title="Remove from history"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-zinc-400">Password</label>
                            {!isSignUp && (
                                <Link to="/forgot-password" className="text-sm text-emerald-500 hover:text-emerald-400 font-medium transition-colors">
                                    Forgot password?
                                </Link>
                            )}
                        </div>
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
                        {isSignUp && (
                            <p className="text-xs text-zinc-500 mt-2 ml-1">
                                Password must be at least 6 characters, include one capital letter and one special character (!@#$%^&*)
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            'Processing...'
                        ) : (
                            <>
                                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-zinc-400 hover:text-emerald-500 font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        {isSignUp ? (
                            <>
                                <LogIn size={18} />
                                Already have an account? Sign In
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} />
                                New to FinTrack? Create Account
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
