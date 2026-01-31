import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wallet, TrendingDown, TrendingUp, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const SidebarItem = ({ to, icon: Icon, label }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                    isActive
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                )
            }
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </NavLink>
    );
};

const Layout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-zinc-900 overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 h-full p-6">
                <div className="flex items-center gap-2 px-2 mb-10">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <span className="text-white font-bold text-xl">F</span>
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">FinTrack</h1>
                </div>

                <nav className="flex-1 flex flex-col gap-2">
                    <SidebarItem to="/home" icon={LayoutDashboard} label="Home" />
                    <SidebarItem to="/dashboard" icon={TrendingUp} label="Dashboard" />
                    <SidebarItem to="/income" icon={Wallet} label="Income" />
                    <SidebarItem to="/expense" icon={TrendingDown} label="Expenses" />
                    <SidebarItem to="/profile" icon={User} label="Profile" />
                </nav>

                <div className="mt-auto border-t border-zinc-800 pt-6">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 z-10 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">F</span>
                        </div>
                        <span className="font-bold text-zinc-100">FinTrack</span>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 bg-zinc-900">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 h-20 flex justify-around items-center px-2 z-20 pb-2">
                    <NavLink to="/home" className={({ isActive }) => clsx("flex flex-col items-center p-2", isActive ? "text-primary-500" : "text-zinc-500")}>
                        <LayoutDashboard size={24} />
                        <span className="text-[10px] mt-1 font-medium">Home</span>
                    </NavLink>
                    <NavLink to="/dashboard" className={({ isActive }) => clsx("flex flex-col items-center p-2", isActive ? "text-primary-500" : "text-zinc-500")}>
                        <TrendingUp size={24} />
                        <span className="text-[10px] mt-1 font-medium">Dash</span>
                    </NavLink>
                    <div className="relative -top-5">
                        <NavLink to="/income" className={({ isActive }) => clsx("flex flex-col items-center justify-center w-14 h-14 rounded-full shadow-lg border-4 border-zinc-900", isActive ? "bg-primary-600 text-white" : "bg-zinc-800 text-zinc-400 border-zinc-800")}>
                            <Wallet size={24} />
                        </NavLink>
                    </div>
                    <NavLink to="/expense" className={({ isActive }) => clsx("flex flex-col items-center p-2", isActive ? "text-primary-500" : "text-zinc-500")}>
                        <TrendingDown size={24} />
                        <span className="text-[10px] mt-1 font-medium">Exp</span>
                    </NavLink>
                    <NavLink to="/profile" className={({ isActive }) => clsx("flex flex-col items-center p-2", isActive ? "text-primary-500" : "text-zinc-500")}>
                        <User size={24} />
                        <span className="text-[10px] mt-1 font-medium">Profile</span>
                    </NavLink>
                </nav>
            </div>
        </div>
    );
};

export default Layout;
