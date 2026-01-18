import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MessageSquare } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Navbar } from '../components/Navbar';
import { getAvatarUrl, getReadingTime, UserBadge } from '../utils/uiUtils';
import { useAuthStore } from '../context/useAuthStore';

interface Comment {
    id: number;
    content: string;
    postId: number;
    userId: number;
    authorName: string;
    createdAt: string;
}

interface PostDetails {
    id: number;
    title: string;
    content: string;
    authorName: string;
    authorRole?: string;
    categoryName: string;
    createdAt: string;
    comments: Comment[];
}

export const PostDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<PostDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const { token } = useAuthStore();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get<PostDetails>(`/posts/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPost();
    }, [id]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !newComment.trim()) return;

        try {
            await api.post('/posts/comments', {
                content: newComment,
                postId: parseInt(id)
            });
            setNewComment('');
            // Reload post to see new comment
            const response = await api.get<PostDetails>(`/posts/${id}`);
            setPost(response.data);
            toast.success('Comment added!');
        } catch (error) {
            console.error('Error posting comment:', error);
            toast.error('Failed to post comment');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading discussion...</p>
        </div>
    );

    if (!post) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post not found</h1>
                <a href="/" className="text-indigo-600 hover:underline">Back to Home</a>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
            <Navbar />
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden mb-8">
                    <div className="px-6 py-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">{post.title}</h1>
                            <span className="inline-flex self-start items-center px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">
                                {post.categoryName}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center">
                                <img
                                    src={getAvatarUrl(post.authorName)}
                                    alt={post.authorName}
                                    className="h-12 w-12 rounded-full mr-4 border-2 border-white dark:border-gray-800 shadow-sm"
                                />
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white flex items-center">
                                        {post.authorName}
                                        <UserBadge role={post.authorRole || "User"} />
                                    </p>
                                    <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className="flex items-center bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                                ⏱️ {getReadingTime(post.content)}
                            </span>
                        </div>
                        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-100 dark:bg-gray-900/50 rounded-2xl p-6 md:p-8">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center">
                        <MessageSquare className="h-6 w-6 mr-2 text-indigo-500" />
                        Comments ({post.comments?.length || 0})
                    </h3>
                    <div className="space-y-6 mb-12">
                        {post.comments?.map((comment) => (
                            <div key={comment.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 group transition-all duration-200">
                                <div className="flex items-start">
                                    <img
                                        src={getAvatarUrl(comment.authorName)}
                                        alt={comment.authorName}
                                        className="h-10 w-10 rounded-full mr-4 border border-gray-100 dark:border-gray-800"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-gray-900 dark:text-white flex items-center">
                                                {comment.authorName}
                                                <UserBadge role="User" />
                                            </span>
                                            <span className="text-xs text-gray-400 italic">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!post.comments || post.comments.length === 0) && (
                            <p className="text-center py-8 text-gray-500 font-medium italic">No comments yet. Be the first to share your thoughts!</p>
                        )}
                    </div>

                    {token ? (
                        <form onSubmit={handleCommentSubmit} className="mt-12 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <label htmlFor="comment" className="block text-sm font-black text-gray-900 dark:text-white mb-4 uppercase tracking-widest">Add your comment</label>
                            <div className="mt-1">
                                <textarea
                                    id="comment"
                                    rows={4}
                                    className="block w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent p-4 transition-all shadow-inner"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write your thoughts here..."
                                    required
                                />
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg flex items-center"
                                >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Post Comment
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mt-12 text-center p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                            <p className="text-gray-700 dark:text-gray-300 font-medium mb-4">
                                Join the conversation!
                            </p>
                            <Link to="/login" className="inline-flex items-center px-6 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors">
                                Login to Comment
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
