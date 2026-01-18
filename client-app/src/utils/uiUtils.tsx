import React from 'react';

export const getAvatarUrl = (username: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
};

export const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return `${time} min read`;
};

export const UserBadge: React.FC<{ role?: string }> = ({ role }) => {
    if (role === 'Admin') {
        return (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                👑 Admin
            </span>
        );
    }
    return (
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            User
        </span>
    );
};
