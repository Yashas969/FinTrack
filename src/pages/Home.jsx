import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, LayoutDashboard } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const Card = ({ title, value, icon: Icon, to, colorClass, trend }) => (
    <Link
        to={to}
        className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 shadow-sm hover:shadow-lg transition-all duration-300 group"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${colorClass} text-white`}>
                <Icon className="w-6 h-6" />
            </div>
            {trend && (
                <span className="flex items-center text-xs font-medium text-zinc-400 bg-zinc-700 px-2 py-1 rounded-lg">
                    View Details
                </span>
            )}
        </div>
        <div className="space-y-1">
            <h3 className="text-zinc-400 font-medium text-sm">{title}</h3>
            <p className="text-2xl font-bold text-zinc-100">₹{value.toLocaleString('en-IN')}</p>
        </div>
    </Link>
);

const Home = () => {
    const { user } = useAuth();
    const { totalIncome, totalExpense, balance, incomes, expenses } = useFinance();

    // Simple recent transactions
    const recentTransactions = [...incomes.map(i => ({ ...i, type: 'income' })), ...expenses.map(e => ({ ...e, type: 'expense' }))]
        .sort((a, b) => new Date(b.date || b.id) - new Date(a.date || a.id))
        .slice(0, 5);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100">Hello, {user?.name || user?.username || 'User'}! 👋</h1>
                    <p className="text-zinc-400 mt-2">Here's what's happening with your wallet today.</p>
                </div>
                <Link to="/dashboard" className="hidden sm:flex items-center gap-2 text-primary-500 font-medium hover:text-primary-400">
                    Full Report <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card
                    title="Total Income"
                    value={totalIncome}
                    icon={TrendingUp}
                    to="/income"
                    colorClass="bg-emerald-500"
                />
                <Card
                    title="Total Expenses"
                    value={totalExpense}
                    icon={TrendingDown}
                    to="/expense"
                    colorClass="bg-rose-500"
                />
                <Card
                    title="Savings"
                    value={Math.max(0, balance)}
                    icon={LayoutDashboard}
                    to="/dashboard"
                    colorClass="bg-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="bg-zinc-800 rounded-2xl border border-zinc-700 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-zinc-100 mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {recentTransactions.length > 0 ? (
                            recentTransactions.map((item) => (
                                <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-700/50 transition-colors border border-zinc-700/50 hover:border-zinc-600">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                            {item.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-zinc-100">{item.source || item.category}</p>
                                            <p className="text-xs text-zinc-400">{new Date(item.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold ${item.type === 'income' ? 'text-emerald-500' : 'text-zinc-100'}`}>
                                        {item.type === 'income' ? '+' : '-'}₹{Number(item.amount).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-500 text-center py-8">No recent transactions</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
