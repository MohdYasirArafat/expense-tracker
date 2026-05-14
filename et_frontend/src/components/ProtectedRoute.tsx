import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";
import type { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/user/me");
        setAuth(true);
      } catch {
        setAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (auth === null) return <div>Loading...</div>;

  return auth ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
