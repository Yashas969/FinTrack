import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
    const { user } = useAuth();
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchData();

            // Realtime subscriptions
            const incomeSubscription = supabase
                .channel('income-changes')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'income' }, payload => {
                    handleRealtimeUpdate('income', payload);
                })
                .subscribe();

            const expenseSubscription = supabase
                .channel('expense-changes')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'expense' }, payload => {
                    handleRealtimeUpdate('expense', payload);
                })
                .subscribe();

            return () => {
                supabase.removeChannel(incomeSubscription);
                supabase.removeChannel(expenseSubscription);
            };
        } else {
            setIncomes([]);
            setExpenses([]);
        }
    }, [user]);

    const mapFromDb = (item) => ({
        ...item,
        transactionType: item.transaction_type || item.transactionType
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: incomeData, error: incomeError } = await supabase
                .from('income')
                .select('*')
                .order('date', { ascending: false }); // or created_at

            if (incomeError) throw incomeError;

            const { data: expenseData, error: expenseError } = await supabase
                .from('expense')
                .select('*')
                .order('date', { ascending: false });

            if (expenseError) throw expenseError;

            setIncomes((incomeData || []).map(mapFromDb));
            setExpenses((expenseData || []).map(mapFromDb));
        } catch (error) {
            console.error('Error fetching finance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRealtimeUpdate = (type, payload) => {
        const setFunction = type === 'income' ? setIncomes : setExpenses;

        if (payload.eventType === 'INSERT') {
            setFunction(prev => {
                const newItem = mapFromDb(payload.new);
                if (prev.some(item => item.id === newItem.id)) return prev;
                return [newItem, ...prev];
            });
        } else if (payload.eventType === 'DELETE') {
            setFunction(prev => prev.filter(item => item.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
            setFunction(prev => prev.map(item => item.id === payload.new.id ? mapFromDb(payload.new) : item));
        }
    };

    const addIncome = async (incomeData) => {
        const { date, amount, source, transactionType } = incomeData;
        const { data, error } = await supabase
            .from('income')
            .insert([{
                user_id: user.id,
                date,
                amount,
                source,
                transaction_type: transactionType
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding income:', error);
            alert('Failed to add income: ' + error.message);
        } else if (data) {
            const newItem = mapFromDb(data);
            setIncomes(prev => {
                if (prev.some(item => item.id === newItem.id)) return prev;
                return [newItem, ...prev];
            });
        }
    };

    const addExpense = async (expenseData) => {
        const { date, amount, category, transactionType } = expenseData;
        const { data, error } = await supabase
            .from('expense')
            .insert([{
                user_id: user.id,
                date,
                amount,
                category,
                transaction_type: transactionType
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding expense:', error);
            alert('Failed to add expense: ' + error.message);
        } else if (data) {
            const newItem = mapFromDb(data);
            setExpenses(prev => {
                if (prev.some(item => item.id === newItem.id)) return prev;
                return [newItem, ...prev];
            });
        }
    };

    const deleteIncome = async (id) => {
        const { error } = await supabase.from('income').delete().eq('id', id);
        if (error) {
            console.error('Error deleting income:', error);
        } else {
            setIncomes(prev => prev.filter(item => item.id !== id));
        }
    };

    const deleteExpense = async (id) => {
        const { error } = await supabase.from('expense').delete().eq('id', id);
        if (error) {
            console.error('Error deleting expense:', error);
        } else {
            setExpenses(prev => prev.filter(item => item.id !== id));
        }
    };

    const totalIncome = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const balance = totalIncome - totalExpense;

    const value = {
        incomes,
        expenses,
        addIncome,
        addExpense,
        deleteIncome,
        deleteExpense,
        totalIncome,
        totalExpense,
        balance,
        loading
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
};
