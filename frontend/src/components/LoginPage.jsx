// import React, { useState } from 'react';
// import { useAuth } from '../hooks/useAuth';
// import { MessageCircle, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';

// const LoginPage = () => {
//   const { login, register } = useAuth();
//   const [isLogin, setIsLogin] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: ''
//   });

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       let result;
//       if (isLogin) {
//         result = await login(formData.email, formData.password);
//       } else {
//         result = await register(formData);
//       }

//       if (!result.success) {
//         setError(result.message);
//       }
//     } catch (error) {
//       setError('An unexpected error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
//               <MessageCircle size={32} className="text-white" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Looply
//           </h1>
//           <p className="text-gray-600">
//             {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
//           </p>
//         </div>

//         {/* Form */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {!isLogin && (
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     placeholder="Enter your full name"
//                     className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     required={!isLogin}
//                   />
//                 </div>
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Enter your email"
//                   className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   required
//                 />
//               </div>
//             </div>

//             {!isLogin && (
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Phone Number
//                 </label>
//                 <div className="relative">
//                   <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     placeholder="+1234567890"
//                     className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     required={!isLogin}
//                   />
//                 </div>
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   placeholder="Enter your password"
//                   className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   required
//                   minLength={6}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             {error && (
//               <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
//                 <p className="text-sm text-red-700 font-medium">{error}</p>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center space-x-2">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
//                 </div>
//               ) : (
//                 isLogin ? 'Sign In' : 'Create Account'
//               )}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-gray-600">
//               {isLogin ? "Don't have an account? " : "Already have an account? "}
//               <button
//                 onClick={() => {
//                   setIsLogin(!isLogin);
//                   setError('');
//                   setFormData({ name: '', email: '', phone: '', password: '' });
//                 }}
//                 className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
//               >
//                 {isLogin ? 'Sign Up' : 'Sign In'}
//               </button>
//             </p>
//           </div>

//           {/* Demo Accounts */}
//           <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
//             <p className="text-xs font-semibold text-gray-700 mb-2">Demo Accounts:</p>
//             <div className="text-xs text-gray-600 space-y-1">
//               <p>📧 john@example.com | 🔑 password123</p>
//               <p>📧 jane@example.com | 🔑 password123</p>
//             </div>
//           </div>
//         </div>

//         {/* Features */}
//         <div className="mt-8 grid grid-cols-3 gap-4 text-center">
//           <div className="p-4">
//             <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
//               <MessageCircle size={24} className="text-blue-600" />
//             </div>
//             <p className="text-sm font-medium text-gray-700">Real-time Chat</p>
//           </div>
//           <div className="p-4">
//             <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
//               <User size={24} className="text-green-600" />
//             </div>
//             <p className="text-sm font-medium text-gray-700">Easy Contacts</p>
//           </div>
//           <div className="p-4">
//             <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
//               <Lock size={24} className="text-purple-600" />
//             </div>
//             <p className="text-sm font-medium text-gray-700">Secure</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MessageCircle, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData);
      }

      if (!result.success) {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (email, password) => {
    setFormData({ ...formData, email, password });
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Header */}
        <div className="login-header">
          <div className="app-icon">
            <MessageCircle size={40} />
          </div>
          <h1 className="app-title">Looply</h1>
          <p className="app-subtitle">
            {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Form */}
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="form-input-wrapper">
                  <User size={18} className="form-input-icon" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="form-input"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-wrapper">
                <Mail size={18} className="form-input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="form-input"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="form-input-wrapper">
                  <Phone size={18} className="form-input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1234567890"
                    className="form-input"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrapper">
                <Lock size={18} className="form-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="form-input"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="auth-switch">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', email: '', phone: '', password: '' });
              }}
              className="auth-switch-button"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          {/* Demo Accounts */}
          {/* {isLogin && (
            <div className="demo-accounts">
              <div className="demo-title">Demo Accounts:</div>
              <div 
                className="demo-account"
                onClick={() => fillDemoAccount('john@example.com', 'password123')}
                style={{ cursor: 'pointer' }}
              >
                <span>📧</span> john@example.com | <span>🔑</span> password123
              </div>
              <div 
                className="demo-account"
                onClick={() => fillDemoAccount('jane@example.com', 'password123')}
                style={{ cursor: 'pointer' }}
              >
                <span>📧</span> jane@example.com | <span>🔑</span> password123
              </div>
            </div>
          )} */}
        </div>

        {/* Features */}
        <div className="features-section">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon chat">
                <MessageCircle size={24} />
              </div>
              <p className="feature-title">Real-time Chat</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon contacts">
                <User size={24} />
              </div>
              <p className="feature-title">Easy Contacts</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon secure">
                <Lock size={24} />
              </div>
              <p className="feature-title">Secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
