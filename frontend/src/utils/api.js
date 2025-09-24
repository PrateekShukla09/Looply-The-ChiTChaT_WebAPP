import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://looply-the-chitchat-webapp-1.onrender.com";

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: false, // set to true if you switch to cookie-based auth
});

// Request interceptor → attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Dispatch global event so AuthProvider can handle logout/redirect
      window.dispatchEvent(new Event("unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;

// ==============================
// API functions
// ==============================
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  getMe: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"), // backend marks user offline
};

export const chatAPI = {
  getChats: () => api.get("/chats/my-chats"),
  createChat: (userId) => api.post("/chats/create", { userId }),
  getMessages: (chatId, page = 1) =>
    api.get(`/messages/chat/${chatId}?page=${page}`),
  sendMessage: (messageData) => api.post("/messages/send", messageData),
  markAsRead: (chatId) => api.put(`/messages/chat/${chatId}/read`),
};

export const inviteAPI = {
  getInviteKey: () => api.get("/users/invite-key"),
  generateInviteKey: () => api.post("/users/invite-key/generate"),
  useInviteKey: (inviteKey) => api.post("/users/invite-key/use", { inviteKey }),
  updateInviteSettings: (allowInvites) =>
    api.put("/users/invite-settings", { allowInvites }),
};
