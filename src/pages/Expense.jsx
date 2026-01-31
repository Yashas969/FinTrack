import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Trash2, Calendar, DollarSign, Tag, TrendingDown, CreditCard } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Expense = () => {
    const { expenses, addExpense, deleteExpense, totalExpense } = useFinance();
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        transactionType: 'Cash',
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.category || !formData.amount) return;

        addExpense(formData);
        setFormData({ ...formData, category: '', amount: '' });
    };

    // Prepare Pie Data
    const categoryData = useMemo(() => {
        const categories = {};
        expenses.forEach(e => {
            if (!categories[e.category]) categories[e.category] = 0;
            categories[e.category] += Number(e.amount);
        });
        return Object.entries(categories).map(([name, value]) => ({ name, value }));
    }, [expenses]);

    const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#06b6d4', '#8b5cf6', '#d946ef'];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
                        <TrendingDown className="text-rose-500" /> Expenses
                    </h1>
                    <p className="text-zinc-400">Track your spending</p>
                </div>
                <div className="bg-rose-500/10 text-rose-500 px-6 py-3 rounded-xl font-mono font-bold text-xl border border-rose-500/20">
                    Total: ₹{totalExpense.toLocaleString('en-IN')}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-700 h-fit">
                    <h2 className="font-bold text-zinc-100 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center text-sm">
                            <Plus size={18} />
                        </span>
                        Add New Expense
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="e.g. Rent, Food"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 font-bold">₹</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                    min="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Transaction Type</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <select
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none appearance-none"
                                    value={formData.transactionType}
                                    onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Card">Card</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none [color-scheme:dark]"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-600/20 active:scale-[0.98]"
                        >
                            Add Expense
                        </button>
                    </form>
                </div>

                {/* Chart & List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Chart */}
                    <div className="bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-700 h-64 flex flex-col">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase mb-2">Spending by Category</h3>
                        <div className="flex-1">
                            {categoryData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                                            contentStyle={{
                                                backgroundColor: "#18181b",
                                                border: "1px solid #3f3f46",
                                                color: "#f4f4f5"
                                            }}
                                            labelStyle={{ color: "#f4f4f5" }}
                                            itemStyle={{ color: "#f4f4f5" }}
                                        />
                                        <Legend
                                            verticalAlign="right"
                                            layout="vertical"
                                            align="right"
                                            iconType="circle"
                                            formatter={(value) => <span className="text-zinc-400">{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-zinc-500">No expenses yet</div>
                            )}
                        </div>
                    </div>
                    {/* List */}
                    <div className="bg-zinc-800 rounded-2xl shadow-sm border border-zinc-700 overflow-hidden">
                        <div className="p-4 border-b border-zinc-700 bg-zinc-900/50">
                            <h3 className="font-bold text-zinc-100">History</h3>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {expenses.length === 0 ? (
                                <div className="p-8 text-center text-zinc-500">No expense records yet.</div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-xs font-bold text-zinc-500 uppercase border-b border-zinc-700">
                                            <th className="px-6 py-3">Category</th>
                                            <th className="px-6 py-3">Type</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">Amount</th>
                                            <th className="px-6 py-3 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.map((item) => (
                                            <tr key={item.id} className="border-b border-zinc-700 hover:bg-zinc-700/30 transition-colors group">
                                                <td className="px-6 py-4 font-medium text-zinc-100">{item.category}</td>
                                                <td className="px-6 py-4 text-zinc-400 text-sm">{item.transactionType || 'Cash'}</td>
                                                <td className="px-6 py-4 text-zinc-400 text-sm">{item.date}</td>
                                                <td className="px-6 py-4 text-rose-500 font-bold">-₹{Number(item.amount).toLocaleString('en-IN')}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => deleteExpense(item.id)}
                                                        className="text-zinc-500 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Expense;
