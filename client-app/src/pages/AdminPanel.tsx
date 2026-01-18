import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/useAuthStore';

interface Post {
    id: number;
    title: string;
    authorName: string;
    createdAt: string;
}

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    createdAt: string;
    mutedUntil: string | null;
    bannedUntil: string | null;
    isMuted: boolean;
    isBanned: boolean;
}

const DURATION_OPTIONS = [
    { label: '15 min', value: 15 },
    { label: '1 hour', value: 60 },
    { label: '24 hours', value: 1440 },
    { label: '7 days', value: 10080 },
    { label: 'Permanent', value: 0 },
];

export const AdminPanel: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<'posts' | 'users'>('posts');
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [actionModal, setActionModal] = useState<{ userId: number; action: 'mute' | 'ban' } | null>(null);
    const { isAdmin, token } = useAuthStore();
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'posts') {
                const response = await api.get<Post[]>('/posts');
                setPosts(response.data);
            } else {
                const response = await api.get<User[]>('/auth/users');
                setUsers(response.data);
            }
        } catch (error) {
            console.error(`Error fetching ${activeTab}:`, error);
            toast.error(`Failed to load ${activeTab}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token || !isAdmin) {
            navigate('/');
            return;
        }
        fetchData();
    }, [token, isAdmin, navigate, activeTab]);

    const handleDeletePost = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        setDeletingId(id);
        try {
            await api.delete(`/posts/${id}`);
            setPosts(posts.filter(post => post.id !== id));
            toast.success('Post deleted successfully');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to delete post';
            toast.error(message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!window.confirm('WARNING: Deleting this user will also delete all their posts and comments. Proceed?')) return;

        setDeletingId(id);
        try {
            await api.delete(`/auth/users/${id}`);
            setUsers(users.filter(user => user.id !== id));
            toast.success('User and associated data deleted');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to delete user';
            toast.error(message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleModeration = async (userId: number, action: 'mute' | 'ban', duration: number) => {
        try {
            await api.post(`/auth/users/${userId}/${action}`, { durationMinutes: duration });
            toast.success(`User ${action}ed successfully`);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${action} user`);
        }
        setActionModal(null);
    };

    const handleUnmoderate = async (userId: number, action: 'unmute' | 'unban') => {
        try {
            await api.post(`/auth/users/${userId}/${action}`);
            toast.success(`User ${action}d successfully`);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${action} user`);
        }
    };

    const formatUntil = (dateStr: string | null) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (date.getFullYear() > 9000) return 'Permanent';
        return date.toLocaleString();
    };

    if (loading && posts.length === 0 && users.length === 0) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
            <Navbar />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Admin Control Center</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage your community's content and members.</p>
                    </div>

                    <div className="flex p-1 bg-gray-200 dark:bg-gray-800 rounded-2xl w-fit">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'posts'
                                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            Posts
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'users'
                                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            Users
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            {activeTab === 'posts' ? 'Active Discussions Management' : 'Registered Members Management'}
                        </h2>
                        {loading && <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>}
                    </div>

                    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                        {activeTab === 'posts' ? (
                            <>
                                {posts.map((post) => (
                                    <li key={post.id} className="px-6 py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {post.title}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                                <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">@{post.authorName}</span>
                                                <span className="mx-2">•</span>
                                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            disabled={deletingId === post.id}
                                            className={`ml-6 px-4 py-2 rounded-xl text-sm font-bold transition-all transform hover:scale-105 flex items-center gap-2 ${deletingId === post.id
                                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white'
                                                }`}
                                        >
                                            {deletingId === post.id ? 'Deleting...' : 'Delete Post'}
                                        </button>
                                    </li>
                                ))}
                                {posts.length === 0 && !loading && (
                                    <li className="px-6 py-12 text-center text-gray-500 italic">No posts found in the database.</li>
                                )}
                            </>
                        ) : (
                            <>
                                {users.map((user) => (
                                    <li key={user.id} className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                                        {user.username}
                                                    </p>
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${user.role === 'Admin'
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                    {user.isMuted && (
                                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-yellow-500 text-white">
                                                            🔇 Muted until {formatUntil(user.mutedUntil)}
                                                        </span>
                                                    )}
                                                    {user.isBanned && (
                                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-red-600 text-white">
                                                            🚫 Banned until {formatUntil(user.bannedUntil)}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                                    <span className="truncate">{user.email}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                                </p>
                                            </div>
                                            {user.role !== 'Admin' && (
                                                <div className="flex gap-2 ml-4 flex-wrap">
                                                    {user.isMuted ? (
                                                        <button
                                                            onClick={() => handleUnmoderate(user.id, 'unmute')}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white transition-all"
                                                        >
                                                            Unmute
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setActionModal({ userId: user.id, action: 'mute' })}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-600 hover:text-white transition-all"
                                                        >
                                                            Mute
                                                        </button>
                                                    )}
                                                    {user.isBanned ? (
                                                        <button
                                                            onClick={() => handleUnmoderate(user.id, 'unban')}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white transition-all"
                                                        >
                                                            Unban
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setActionModal({ userId: user.id, action: 'ban' })}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-600 hover:text-white transition-all"
                                                        >
                                                            Ban
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        disabled={deletingId === user.id}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${deletingId === user.id
                                                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                                            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white'
                                                            }`}
                                                    >
                                                        {deletingId === user.id ? '...' : 'Delete'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                                {users.length === 0 && !loading && (
                                    <li className="px-6 py-12 text-center text-gray-500 italic">No users found in the database.</li>
                                )}
                            </>
                        )}
                    </ul>
                </div>
            </div>

            {actionModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 capitalize">
                            {actionModal.action} User
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Select duration for {actionModal.action}:
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {DURATION_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleModeration(actionModal.userId, actionModal.action, opt.value)}
                                    className={`px-4 py-3 rounded-xl font-bold transition-all hover:scale-105 ${opt.value === 0
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setActionModal(null)}
                            className="mt-6 w-full py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
