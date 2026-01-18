import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface UserPayload {
    sub: string;
    email: string;
    unique_name: string;
    role?: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

interface AuthState {
    token: string | null;
    user: UserPayload | null;
    isAdmin: boolean;
    setToken: (token: string) => void;
    logout: () => void;
}

const getIsAdmin = (user: UserPayload | null): boolean => {
    if (!user) return false;
    const role = user.role || user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return role?.toLowerCase() === 'admin';
};

const decodeToken = (token: string): UserPayload | null => {
    try {
        return jwtDecode<UserPayload>(token);
    } catch (error) {
        return null;
    }
};

export const useAuthStore = create<AuthState>((set) => {
    const token = localStorage.getItem('token');
    const user = token ? decodeToken(token) : null;
    const isAdmin = getIsAdmin(user);

    return {
        token,
        user,
        isAdmin,
        setToken: (token) => {
            localStorage.setItem('token', token);
            const user = decodeToken(token);
            set({ token, user, isAdmin: getIsAdmin(user) });
        },
        logout: () => {
            localStorage.removeItem('token');
            set({ token: null, user: null, isAdmin: false });
        },
    };
});
