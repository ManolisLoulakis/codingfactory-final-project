import { useEffect, useState } from 'react';
import api from '../services/api';
import { Navbar } from '../components/Navbar';
import { Search, MessageSquare, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAvatarUrl, getReadingTime, UserBadge } from '../utils/uiUtils';

interface Post {
    id: number;
    title: string;
    content: string;
    authorName: string;
    categoryName: string;
    categoryId: number;
    createdAt: string;
    commentsCount: number;
}

interface Category {
    id: number;
    name: string;
}

export const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsRes, catsRes] = await Promise.all([
                    api.get<Post[]>('/posts'),
                    api.get<Category[]>('/categories')
                ]);
                setPosts(postsRes.data);
                setCategories(catsRes.data);
                setFilteredPosts(postsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let results = posts;

        if (selectedCategory) {
            results = results.filter(post => post.categoryId === selectedCategory);
        }

        if (searchTerm) {
            results = results.filter(post =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredPosts(results);
    }, [searchTerm, posts, selectedCategory]);

    const trendingPosts = [...posts]
        .sort((a, b) => b.commentsCount - a.commentsCount)
        .slice(0, 5);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
            <Navbar />

            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-800 dark:to-cyan-800 text-white py-16 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                        Welcome to MyOpinion
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-teal-100">
                        Share your thoughts, discover new perspectives, and engage with our community.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Link to="/create-post" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-teal-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 md:text-lg transition-all transform hover:scale-105 shadow-lg">
                            Share Your Opinion
                        </Link>
                    </div>
                </div>
            </div>

            <div id="posts" className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col space-y-6 mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Explore Opinions</h2>

                        <div className="relative w-full md:w-96 group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent sm:text-sm shadow-sm transition-all"
                                placeholder="Search discussions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex overflow-x-auto pb-2 scrollbar-hide space-x-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === null
                                ? 'bg-teal-600 text-white shadow-md'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            All Posts
                        </button>
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category.id
                                    ? 'bg-teal-600 text-white shadow-md'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="text-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                                <p className="mt-4 text-slate-500 dark:text-slate-400">Loading discussions...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredPosts.map((post) => (
                                    <div key={post.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 group">
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                                                    {post.categoryName}
                                                </span>
                                                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-4">
                                                    <span className="flex items-center bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                                                        ⏱️ {getReadingTime(post.content)}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Calendar className="h-3.5 w-3.5 mr-1" />
                                                        {new Date(post.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link to={`/posts/${post.id}`} className="block">
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-3">
                                                    {post.title}
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                                                    {post.content}
                                                </p>
                                            </Link>

                                            <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <img
                                                        src={getAvatarUrl(post.authorName)}
                                                        alt={post.authorName}
                                                        className="h-10 w-10 rounded-full mr-3 border-2 border-white dark:border-slate-800 shadow-sm"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                            {post.authorName}
                                                        </span>
                                                        <UserBadge role="User" />
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/posts/${post.id}`}
                                                    className="flex items-center text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 group/link"
                                                >
                                                    <MessageSquare className="h-4 w-4 mr-1.5" />
                                                    {post.commentsCount} comments
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {filteredPosts.length === 0 && (
                                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                        <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No discussions found</h3>
                                        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-2">
                                            We couldn't find any posts matching your criteria. Try a different search or category.
                                        </p>
                                        <button
                                            onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
                                            className="mt-6 text-teal-600 dark:text-teal-400 font-bold hover:underline"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 sticky top-24">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                                <span className="mr-2">🔥</span> Trending Now
                            </h3>
                            <div className="space-y-6">
                                {trendingPosts.map((post, index) => (
                                    <Link
                                        key={post.id}
                                        to={`/posts/${post.id}`}
                                        className="group block"
                                    >
                                        <div className="flex items-start space-x-3">
                                            <span className="text-2xl font-black text-slate-100 dark:text-slate-800 group-hover:text-teal-100 transition-colors">
                                                0{index + 1}
                                            </span>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                                                    {post.title}
                                                </h4>
                                                <div className="mt-1 flex items-center text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="font-medium">{post.authorName}</span>
                                                    <span className="mx-1">•</span>
                                                    <span>{post.commentsCount} comments</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
                                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                    &copy; 2026 MyOpinion<br />Share your voice, respect others!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
