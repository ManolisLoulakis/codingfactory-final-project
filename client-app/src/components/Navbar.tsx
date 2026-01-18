import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../context/useAuthStore';
import { getAvatarUrl } from '../utils/uiUtils';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
    const { token, logout, isAdmin, user } = useAuthStore();

    return (
        <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center font-bold text-xl text-teal-600 dark:text-teal-400">
                            💬 MyOpinion
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        {token ? (
                            <>
                                <div className="flex items-center mr-4">
                                    {user && (
                                        <>
                                            <img
                                                src={getAvatarUrl(user.unique_name || 'User')}
                                                alt="Profile"
                                                className="h-8 w-8 rounded-full border-2 border-teal-200 dark:border-teal-800"
                                            />
                                            <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300 hidden md:block">
                                                {user.unique_name}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <Link to="/create-post" className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-colors">
                                    New Post
                                </Link>
                                {isAdmin && (
                                    <Link to="/admin" className="text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 px-3 py-2 rounded-md text-sm font-medium">
                                        Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 rounded-md text-sm font-medium">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
