import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Navbar } from '../components/Navbar';
import { X } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

export const CreatePostPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get<Category[]>('/categories');
                setCategories(response.data);
            } catch (err) {
                console.error('Failed to load categories', err);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId) {
            setError('Please select a category');
            return;
        }

        try {
            await api.post('/posts', { title, content, categoryId });
            toast.success('Post created successfully!');
            navigate('/');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to create post');
        }
    };

    const handleClose = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
            <Navbar />
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-100 dark:border-slate-800 p-8 relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Close"
                    >
                        <X className="h-6 w-6 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300" />
                    </button>

                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Share Your Opinion</h1>
                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-800/50 text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">Title</label>
                            <input
                                type="text"
                                required
                                className="block w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent p-3 shadow-sm transition-all"
                                placeholder="What's on your mind?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">Category</label>
                            <select
                                required
                                className="block w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent p-3 shadow-sm transition-all"
                                value={categoryId}
                                onChange={(e) => setCategoryId(Number(e.target.value))}
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">Content</label>
                            <textarea
                                required
                                rows={6}
                                className="block w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent p-4 shadow-sm transition-all"
                                placeholder="Share your thoughts..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 transition-all transform hover:scale-105 shadow-lg shadow-teal-500/20"
                            >
                                Publish
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
