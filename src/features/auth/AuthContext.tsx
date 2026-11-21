import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react';

type AuthContextType = {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => localStorage.getItem('verde_logged_in') === 'true'
    );

    function login() {
        localStorage.setItem('verde_logged_in', 'true');
        setIsAuthenticated(true);
    }

    function logout() {
        localStorage.removeItem('verde_logged_in');
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
    }

    return context;
}
