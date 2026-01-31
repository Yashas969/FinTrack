import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Trash2, Calendar, DollarSign, Tag, TrendingUp, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const Income = () => {
    const { incomes, addIncome, deleteIncome, totalIncome } = useFinance();
    const [formData, setFormData] = useState({
        source: '',
        amount: '',
        transactionType: 'Cash',
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.source || !formData.amount) return;

        addIncome(formData);
        setFormData({ ...formData, source: '', amount: '' });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
                        <TrendingUp className="text-emerald-500" /> Income
                    </h1>
                    <p className="text-zinc-400">Manage your earnings</p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 px-6 py-3 rounded-xl font-mono font-bold text-xl border border-emerald-500/20">
                    Total: ₹{totalIncome.toLocaleString('en-IN')}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-700 h-fit">
                    <h2 className="font-bold text-zinc-100 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm">
                            <Plus size={18} />
                        </span>
                        Add New Income
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Source</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="e.g. Salary, Freelance"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                    value={formData.source}
                                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
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
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
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
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none"
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
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none [color-scheme:dark]"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                        >
                            Add Entry
                        </button>
                    </form>
                </div>

                {/* Chart & List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Chart */}
                    <div className="bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-700 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={incomes.slice(0, 7).reverse()}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                <XAxis dataKey="source" hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', color: '#f4f4f5' }}
                                    cursor={{ fill: '#27272a' }}
                                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                                />
                                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]}>
                                    {incomes.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#10b981" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* List */}
                    <div className="bg-zinc-800 rounded-2xl shadow-sm border border-zinc-700 overflow-hidden">
                        <div className="p-4 border-b border-zinc-700 bg-zinc-900/50">
                            <h3 className="font-bold text-zinc-100">History</h3>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {incomes.length === 0 ? (
                                <div className="p-8 text-center text-zinc-500">No income records yet.</div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-xs font-bold text-zinc-500 uppercase border-b border-zinc-700">
                                            <th className="px-6 py-3">Source</th>
                                            <th className="px-6 py-3">Type</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">Amount</th>
                                            <th className="px-6 py-3 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incomes.map((item) => (
                                            <tr key={item.id} className="border-b border-zinc-700 hover:bg-zinc-700/30 transition-colors group">
                                                <td className="px-6 py-4 font-medium text-zinc-100">{item.source}</td>
                                                <td className="px-6 py-4 text-zinc-400 text-sm">{item.transactionType || 'Cash'}</td>
                                                <td className="px-6 py-4 text-zinc-400 text-sm">{item.date}</td>
                                                <td className="px-6 py-4 text-emerald-500 font-bold">+₹{Number(item.amount).toLocaleString('en-IN')}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => deleteIncome(item.id)}
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

export default Income;
