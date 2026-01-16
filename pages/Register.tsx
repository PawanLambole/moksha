import React, { useState } from 'react';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import { mockStore } from '../services/mockStore';
import { Eye, EyeOff, RefreshCw, Send, CheckCircle } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    mobile: '',
  });
  const [otp, setOtp] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('8X2A'); 
  const [showPassword, setShowPassword] = useState(false);
  
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = () => {
    if (!formData.mobile || formData.mobile.length < 10) {
      setError('Please enter a valid mobile number first.');
      return;
    }
    setIsOtpSent(true);
    setError('');
    alert(`MOCK OTP: 1234 sent to ${formData.mobile}`);
  };

  const handleVerifyOtp = () => {
    if (otpInput === '1234') {
      setIsOtpVerified(true);
      setError('');
    } else {
      setError('Invalid OTP. Try 1234.');
    }
  };

  const regenerateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpVerified) {
      setError('Please verify mobile number first.');
      return;
    }
    if (captcha.toUpperCase() !== generatedCaptcha) {
      setError('Incorrect Captcha.');
      regenerateCaptcha();
      return;
    }

    setLoading(true);
    setError('');

    try {
      await mockStore.register({
        fullName: formData.fullName,
        username: formData.username,
        password: formData.password,
        mobile: formData.mobile,
        role: UserRole.BUYER,
      });
      alert('Registration successful! Please wait for Admin approval.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12">
      <div className="max-w-md w-full glass-panel rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="bg-gradient-to-r from-saffron-600 to-saffron-700 p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20"></div>
           <div className="relative z-10">
            <h2 className="text-2xl font-serif font-bold text-white">Join Moksha Bidding</h2>
            <p className="text-saffron-100 mt-1 text-sm">Create your Buyer Account</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm rounded-r">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
            <input
              type="text"
              required
              className="block w-full rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-saffron-500 focus:ring-saffron-500 shadow-sm p-2.5 text-gray-900 placeholder-gray-400"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
            <input
              type="text"
              required
              className="block w-full rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-saffron-500 focus:ring-saffron-500 shadow-sm p-2.5 text-gray-900 placeholder-gray-400"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="block w-full rounded-lg border-gray-300 bg-gray-50 focus:bg-white focus:border-saffron-500 focus:ring-saffron-500 shadow-sm p-2.5 pr-10 text-gray-900 placeholder-gray-400"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile & OTP Section */}
          <div className="space-y-3 p-4 bg-saffron-50/50 rounded-lg border border-saffron-100">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mobile Number</label>
               <div className="flex mt-1 space-x-2">
                 <div className="flex-1 relative">
                    <input
                      type="tel"
                      required
                      disabled={isOtpVerified}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 border p-2.5 disabled:bg-gray-100 text-sm text-gray-900 placeholder-gray-400"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="9876543210"
                    />
                 </div>
                 {!isOtpVerified && (
                   <button
                     type="button"
                     onClick={handleSendOtp}
                     className="px-4 py-2 bg-maroon-800 text-white rounded-lg hover:bg-maroon-900 text-xs font-bold uppercase tracking-wide flex items-center shadow-md transition-colors whitespace-nowrap"
                   >
                     {isOtpSent ? 'Resend' : 'Send OTP'}
                     <Send size={14} className="ml-2" />
                   </button>
                 )}
                 {isOtpVerified && (
                   <div className="flex items-center justify-center px-2">
                     <CheckCircle className="text-green-600 w-6 h-6" />
                   </div>
                 )}
               </div>
            </div>

            {isOtpSent && !isOtpVerified && (
              <div className="flex space-x-2 animate-fade-in items-center">
                <input
                  type="text"
                  className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 border p-2.5 text-center tracking-widest text-gray-900"
                  placeholder="Enter OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-bold uppercase shadow-sm"
                >
                  Verify
                </button>
              </div>
            )}
          </div>

          {/* Captcha */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Captcha Verification</label>
            <div className="flex items-stretch space-x-3 mt-1 h-11">
              <div className="bg-gradient-to-r from-saffron-100 to-white px-3 rounded-lg border border-saffron-300 font-mono text-xl font-bold tracking-widest select-none text-saffron-800 line-through decoration-double decoration-saffron-400 w-32 flex items-center justify-center shadow-inner">
                {generatedCaptcha}
              </div>
              <button 
                type="button" 
                onClick={regenerateCaptcha} 
                className="flex items-center justify-center px-2 text-gray-400 hover:text-saffron-600 transition-colors bg-gray-50 rounded-lg border border-transparent hover:border-saffron-200"
                title="Refresh Captcha"
              >
                <RefreshCw size={20} />
              </button>
              <input
                type="text"
                required
                placeholder="ENTER CODE"
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 border p-2.5 uppercase text-gray-900 text-center font-medium placeholder-gray-400"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isOtpVerified}
            className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-gradient-to-r from-saffron-600 to-maroon-700 hover:from-saffron-500 hover:to-maroon-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron-500 transition-all transform hover:-translate-y-0.5 ${
              (loading || !isOtpVerified) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating Account...' : 'Register as Buyer'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} className="font-bold text-saffron-700 hover:text-saffron-600 cursor-pointer hover:underline">
              Sign in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;