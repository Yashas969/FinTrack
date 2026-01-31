import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const Dashboard = () => {
    const { totalIncome, totalExpense, balance, incomes, expenses } = useFinance();

    // Pie Chart Data
    const pieData = [
        { name: 'Income', value: totalIncome, color: '#10b981' },
        { name: 'Expense', value: totalExpense, color: '#ef4444' },
    ].filter(d => d.value > 0);

    // Bar Chart Data
    const monthlyData = useMemo(() => {
        const months = {};

        // Helper to get Month Year key
        const getMonthKey = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleString('default', { month: 'short' });
        };

        [...incomes].forEach(i => {
            const m = getMonthKey(i.date);
            if (!months[m]) months[m] = { name: m, income: 0, expense: 0 };
            months[m].income += Number(i.amount);
        });

        [...expenses].forEach(e => {
            const m = getMonthKey(e.date);
            if (!months[m]) months[m] = { name: m, income: 0, expense: 0 };
            months[m].expense += Number(e.amount);
        });

        // Sort by month order roughly (hacky for prototype)
        const monthOrder = { 'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 };

        // If empty, return dummy
        if (Object.keys(months).length === 0) {
            return [
                { name: 'Jan', income: 4000, expense: 2400 },
                { name: 'Feb', income: 3000, expense: 1398 },
                { name: 'Mar', income: 2000, expense: 9800 },
                { name: 'Apr', income: 2780, expense: 3908 },
                { name: 'May', income: 1890, expense: 4800 },
                { name: 'Jun', income: 2390, expense: 3800 },
            ];
        }

        return Object.values(months)
            .sort((a, b) => monthOrder[a.name] - monthOrder[b.name]);

    }, [incomes, expenses]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-zinc-100">Financial Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-700">
                    <p className="text-zinc-400 text-sm font-medium">Total Income</p>
                    <p className="text-3xl font-bold text-emerald-500 mt-2">₹{totalIncome.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-700">
                    <p className="text-zinc-400 text-sm font-medium">Total Expense</p>
                    <p className="text-3xl font-bold text-rose-500 mt-2">₹{totalExpense.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-700">
                    <p className="text-zinc-400 text-sm font-medium">Net Balance</p>
                    <p className={`text-3xl font-bold mt-2 ${balance >= 0 ? 'text-zinc-100' : 'text-rose-500'}`}>
                        ₹{balance.toLocaleString('en-IN')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                {/* Bar Chart */}
                <div className="bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-700 flex flex-col">
                    <h3 className="font-bold text-zinc-100 mb-4">Monthly Overview</h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa' }} />
                                <RechartsTooltip
                                    contentStyle={{
                                        backgroundColor: "#18181b",
                                        border: "1px solid #3f3f46",
                                        color: "#f4f4f5"
                                    }}
                                    labelStyle={{ color: "#f4f4f5" }}
                                    itemStyle={{ color: "#f4f4f5" }}
                                    cursor={{ fill: '#27272a' }}
                                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`]}
                                />
                                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-700 flex flex-col">
                    <h3 className="font-bold text-zinc-100 mb-4">Income vs Expense</h3>
                    <div className="flex-1">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        formatter={(value) => [`₹${value.toLocaleString("en-IN")}`]}
                                        contentStyle={{
                                            backgroundColor: "#18181b",
                                            border: "1px solid #3f3f46",
                                            color: "#f4f4f5"
                                        }}
                                        labelStyle={{ color: "#f4f4f5" }}
                                        itemStyle={{ color: "#f4f4f5" }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-zinc-400">{value}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-zinc-500">
                                No data available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
