import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";

// Firebase
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      // 1️⃣ Try JWT persistence
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authAPI.getMe();
          if (response.data.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.warn("JWT expired, clearing token.");
          localStorage.removeItem("token");
        }
      }

      // 2️⃣ Firebase OTP listener
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken();
          try {
            const response = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify`,
              { idToken }
            );

            if (response.data.success) {
              // ✅ Save backend JWT
              localStorage.setItem("token", response.data.token);
              setUser(response.data.user);
              setIsAuthenticated(true);
            }
          } catch (err) {
            console.error("Auth verification failed:", err);
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    initAuth();

    // 3️⃣ Listen for unauthorized events from api.js
    const handleUnauthorized = () => {
      console.warn("401 detected → logging out");
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    };

    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [navigate]);

  // -----------------------------
  // Email/Password Login
  // -----------------------------
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // -----------------------------
  // Email/Password Register
  // -----------------------------
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const logout = async () => {
    try {
      // Optional: Sign out Firebase too
      await signOut(auth).catch(() => {});

      // Clear token
      localStorage.removeItem("token");

      // Notify backend (just for DB status update)
      await authAPI.logout();

      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};


//   const checkAuthStatus = async () => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const response = await authAPI.getMe();
//         if (response.data.success) {
//           setUser(response.data.user);
//           setIsAuthenticated(true);
//         }
//       } catch (error) {
//         localStorage.removeItem("token");
//       }
//     }
//     setLoading(false);
//   };

//   const login = async (email, password) => {
//     try {
//       const response = await authAPI.login(email, password);
//       if (response.data.success) {
//         localStorage.setItem("token", response.data.token);
//         setUser(response.data.user);
//         setIsAuthenticated(true);
//         return { success: true };
//       }
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || "Login failed",
//       };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await authAPI.register(userData);
//       if (response.data.success) {
//         localStorage.setItem("token", response.data.token);
//         setUser(response.data.user);
//         setIsAuthenticated(true);
//         return { success: true };
//       }
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || "Registration failed",
//       };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   const value = {
//     user,
//     loading,
//     isAuthenticated,
//     login,
//     register,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
