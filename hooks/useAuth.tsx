import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
    isLogged: boolean;
    setIsLogged: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLogged, setIsLogged] = useState(false);

    return (
        <AuthContext.Provider value={{ isLogged, setIsLogged }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}
