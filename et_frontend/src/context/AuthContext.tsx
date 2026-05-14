// import React, { createContext, useContext, useState, useEffect } from "react";
// import api from "../api/axios";

// interface AuthContextType {
//   user: any;
//   login: (userData: any) => void;
//   logout: () => void;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   // Check login status on page refresh/load
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         // Ek chota profile or summary check route call karein jo login hone par hi chalta ho
//         const res = await api.get("/expense/summary");
//         if (res.data) setUser({ loggedIn: true }); 
//       } catch (err) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   const login = (userData: any) => setUser(userData);
//   const logout = () => setUser(null);

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };


import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check login status on page refresh/load securely
  useEffect(() => {
    const checkAuth = async () => {
      // 🟢 FIX: Pehle check karein ki kya user pehle kabhi login hua tha
      const hasSession = localStorage.getItem("isLoggedIn") === "true";

      if (!hasSession) {
        setUser(null);
        setLoading(false);
        return; // Agar session flag nahi hai toh bina wajah API hit mat karo
      }

      try {
        // Safe profile validation fallback request
        const res = await api.get("/expense/summary");
        if (res.data) {
          setUser({ loggedIn: true });
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("isLoggedIn"); // Session state clear karein
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // 🟢 FIX: Axios global handler event listener mapping
    const handleGlobalLogout = () => {
      localStorage.removeItem("isLoggedIn");
      setUser(null);
      window.location.href = "/login";
    };

    window.addEventListener("auth-session-expired", handleGlobalLogout);
    return () => window.removeEventListener("auth-session-expired", handleGlobalLogout);
  }, []);

  const login = (userData: any) => {
    localStorage.setItem("isLoggedIn", "true"); // 🟢 Local storage update trace
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn"); // 🟢 Clear active persistent flags
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
