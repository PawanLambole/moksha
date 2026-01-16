import React, { useState } from 'react';
import { UserRole, UserStatus } from '../types';
import { useNavigate } from 'react-router-dom';
import { mockStore } from '../services/mockStore';

import { Shield, User, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await mockStore.login(username, role);

      if (!user) {
        throw new Error('Invalid credentials or role');
      }

      if (user.password !== password) {
        throw new Error('Invalid password');
      }

      if (user.role === UserRole.BUYER && user.status === UserStatus.PENDING) {
        throw new Error('Your account is still under verification by Admin.');
      }

      if (user.role === UserRole.BUYER && user.status === UserStatus.REJECTED) {
        throw new Error('Your account application has been rejected.');
      }

      onLoginSuccess(user);

      if (user.role === UserRole.ADMIN) {
        navigate('/admin/products');
      } else {
        navigate('/buyer/home');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full glass-panel rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Header with decorative bg */}
        <div className="bg-gradient-to-br from-maroon-800 to-maroon-900 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold text-gold-400 drop-shadow-sm">Welcome Back</h2>
            <p className="text-saffron-100 mt-2 font-light">Enter the sanctuary of rare artifacts</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm rounded-r shadow-sm">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="bg-gray-100 p-1.5 rounded-xl flex">
            <button
              type="button"
              onClick={() => setRole(UserRole.BUYER)}
              className={`flex-1 flex items-center justify-center py-2 rounded-lg text-sm font-bold transition-all duration-300 ${role === UserRole.BUYER
                  ? 'bg-white text-maroon-900 shadow-md ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <User className="w-4 h-4 mr-2" />
              Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole(UserRole.ADMIN)}
              className={`flex-1 flex items-center justify-center py-2 rounded-lg text-sm font-bold transition-all duration-300 ${role === UserRole.ADMIN
                  ? 'bg-white text-maroon-900 shadow-md ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
              <input
                type="text"
                required
                className="block w-full rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-saffron-500 focus:ring-saffron-500 shadow-sm p-3 transition-colors text-gray-900 placeholder-gray-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-saffron-500 focus:ring-saffron-500 shadow-sm p-3 pr-10 transition-colors text-gray-900 placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3.5 px-4 rounded-lg shadow-lg text-sm font-bold text-white bg-gradient-to-r from-saffron-600 to-maroon-700 hover:from-saffron-500 hover:to-maroon-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 transition-all transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
          >
            {loading ? 'Verifying Credentials...' : 'Sign In to Moksha'}
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-500">
              New to Moksha? <span onClick={() => navigate('/register')} className="text-saffron-700 font-bold cursor-pointer hover:text-saffron-600 hover:underline">Register as a Buyer</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;