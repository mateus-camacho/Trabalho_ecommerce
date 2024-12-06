import { User } from "@/core/models/user.model";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  token: string | undefined;
  user: User | undefined;
  createSession: (token: string) => void;
  destroySession: () => void;
  isAuthenticated: () => boolean;
  tokenIsExpired: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>();
  const [token, setToken] = useState<string | undefined>();

  const createSession = (token: string) => {
    const { decodedToken } = jwt(token);

    setToken(token);
    setUser(decodedToken);

    localStorage.setItem("token", token);
  };

  const destroySession = () => {
    setToken(undefined);
    setUser(undefined);

    localStorage.removeItem("token");
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const tokenIsExpired = () => {
    return jwt(token ?? "").tokenIsExpired;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const { decodedToken, tokenIsExpired } = jwt(token);

      if (tokenIsExpired) {
        destroySession();
      } else {
        setToken(token);
        setUser(decodedToken);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        createSession,
        destroySession,
        isAuthenticated,
        tokenIsExpired,
      }}
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

function jwt(token: string): {
  decodedToken: User;
  tokenIsExpired: boolean;
} {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const tokenIsExpired = decodedToken.exp < Date.now() / 1000;

  return { decodedToken, tokenIsExpired };
}
