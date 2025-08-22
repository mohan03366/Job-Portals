import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { storage } from "../utils/Storage";
import { api } from "../utils/api";
import { toast } from "../components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => storage.get("jp_auth", null));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    storage.set("jp_auth", auth);
  }, [auth]);

  const logout = useCallback(async () => {
    try {
      // Call the logout API endpoint to clear the cookie
      await fetch(`${env("VITE_API_AUTH_BASE_URL", "")}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout API error:", e);
    } finally {
      // Clear local auth state regardless of API call result
      setAuth(null);
      toast({ title: "Signed out", description: "You have been logged out." });
      navigate("/login");
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const res = await api.register(payload);
      toast({
        title: "Welcome!",
        description: res?.message || "Account created successfully.",
      });
      return res;
    } catch (e) {
      toast({ title: "Registration failed", description: e.message });
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await api.loginUser({ email, password });
      const user = res?.user || res?.data?.user || { email };
      // For cookie-based auth, we don't need to store token
      setAuth({ role: "user", user });
      toast({ title: "Welcome back!", description: "Logged in successfully." });
      return res;
    } catch (e) {
      toast({ title: "Login failed", description: e.message });
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginAdmin = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await api.loginAdmin({ email, password });
      const user = res?.admin || res?.user || { email };
      setAuth({ role: "admin", user });
      toast({ title: "Hello, Admin!", description: "Logged in successfully." });
      return res;
    } catch (e) {
      toast({ title: "Admin login failed", description: e.message });
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      auth,
      setAuth,
      // Changed from checking token to checking auth object existence
      isAuthenticated: !!auth,
      isAdmin: auth?.role === "admin",
      loading,
      register,
      loginUser,
      loginAdmin,
      logout,
    }),
    [auth, loading, loginAdmin, loginUser, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  return ctx;
}
