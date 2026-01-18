import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../context/useAuthStore';

export const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const setToken = useAuthStore((state) => state.setToken);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/register', { username, email, password });
            setToken(response.data.token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white">Join MyOpinion</h2>
                    <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                        Already have an account?{' '}
                        <a href="/login" className="font-medium text-teal-600 hover:text-teal-500">
                            Sign in
                        </a>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-3 rounded-lg text-sm border border-rose-100 dark:border-rose-800/50 text-center">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label className="sr-only">Username</label>
                            <input
                                type="text"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent sm:text-sm"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="sr-only">Email address</label>
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="sr-only">Password</label>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 placeholder-slate-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:scale-[1.02]"
                        >
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
