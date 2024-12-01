import { User } from "@/core/models/user.model";
import React, { createContext, useContext, useState, useEffect } from "react";


type AuthContextType = {
    user: User | undefined;
    isAuthenticated: () => boolean;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | undefined>()

    const login = (token: string) => {
        console.log('token:', token);
        setUser(undefined);
    }

    const logout = () => {
        console.log('logout')
    }

    const isAuthenticated = () => {
        return true;
    }

    useEffect(() => {
        console.log('aaaaaa')
    }, [])

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth: () => AuthContextType = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
