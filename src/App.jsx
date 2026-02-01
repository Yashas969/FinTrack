import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center text-primary-600">Loading...</div>;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <FinanceProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                            <Route index element={<Navigate to="/home" replace />} />
                            <Route path="home" element={<Home />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="income" element={<Income />} />
                            <Route path="expense" element={<Expense />} />
                            <Route path="profile" element={<Profile />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </FinanceProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
