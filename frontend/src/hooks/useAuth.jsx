import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";

// Firebase
import { auth } from "../firebaseConfig";
import { getAuth,onAuthStateChanged, signOut } from "firebase/auth";
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

  useEffect(() => {
    const initAuth = async () => {
      // 🔹 1. Try JWT persistence (email/password flow)
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authAPI.getMe();
          if (response.data.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
            setLoading(false);
            return; // stop here if JWT worked
          }
        } catch (error) {
          console.warn("JWT session expired, clearing token.");
          localStorage.removeItem("token");
        }
      }

      // 🔹 2. Listen for Firebase OTP auth (phone login)
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken();
          try {
            const response = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify`,
              { idToken },
              { withCredentials: true }
            );

            if (response.data.success) {
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
  }, []);

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
  // Logout (works for both flows)
  // -----------------------------
  const logout = async () => {
    try {
      // Sign out from Firebase (for OTP users)
      await signOut(auth).catch(() => {});

      // Clear local token (for JWT users)
      localStorage.removeItem("token");

      // Tell backend to clear session
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login, // email/password
    register, // email/password
    logout, // both
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
