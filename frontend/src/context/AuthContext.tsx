import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabaseClient } from "../utils/supabaseClient";

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async () => {
    const { data, error } = await supabaseClient.auth.getSession();
    if (data?.session) {
      setUser(data.session.user);
      setToken(data.session.access_token);
    }
  };

  const logout = async () => {
    await supabaseClient.auth.signOut();
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    // check initial auth state
    login();

    // listen for changes in auth state
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUser(session.user);
          setToken(session.access_token);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setToken(null);
        }
      }
    );

    // cleanup when unmounting
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
