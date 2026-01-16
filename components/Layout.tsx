import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { LogOut, Menu, X, Gavel, UserCheck, Shield, ShoppingBag, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-maroon-900 via-saffron-800 to-maroon-900 text-white shadow-xl sticky top-0 z-50 border-b-2 border-gold-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div 
                className="flex-shrink-0 flex items-center cursor-pointer group" 
                onClick={() => handleNavClick('/')}
              >
                <div className="bg-white/10 p-2 rounded-full border border-gold-500/30 group-hover:bg-white/20 transition-all duration-300">
                   <Gavel className="h-8 w-8 text-gold-400" />
                </div>
                <div className="ml-3 flex flex-col">
                   <span className="font-serif font-bold text-2xl tracking-widest text-gold-100 group-hover:text-white transition-colors">MOKSHA</span>
                   <span className="text-[0.6rem] uppercase tracking-[0.2em] text-saffron-200">Devotional Bidding</span>
                </div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {user && (
                <>
                  <div className="flex space-x-1">
                  {user.role === UserRole.ADMIN ? (
                    <>
                      <button
                        onClick={() => handleNavClick('/admin/products')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-200 ${
                          isActive('/admin/products') 
                            ? 'bg-gold-500 text-maroon-900 shadow-lg' 
                            : 'text-gold-100 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        Products
                      </button>
                      <button
                        onClick={() => handleNavClick('/admin/approvals')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-200 ${
                          isActive('/admin/approvals') 
                            ? 'bg-gold-500 text-maroon-900 shadow-lg' 
                            : 'text-gold-100 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        Approvals
                      </button>
                    </>
                  ) : (
                     <button
                        onClick={() => handleNavClick('/buyer/home')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-200 ${
                          isActive('/buyer/home') 
                            ? 'bg-gold-500 text-maroon-900 shadow-lg' 
                            : 'text-gold-100 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        Auctions
                      </button>
                  )}
                  </div>
                  
                  <div className="h-8 w-px bg-white/20 mx-2"></div>

                  <div className="flex items-center pl-2 pr-4 py-1.5 bg-black/20 rounded-full border border-white/10 backdrop-blur-sm">
                    {user.role === UserRole.ADMIN ? <Shield className="h-4 w-4 mr-2 text-gold-400" /> : <UserCheck className="h-4 w-4 mr-2 text-saffron-300" />}
                    <span className="text-sm font-semibold text-gray-100">{user.username}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 rounded-full text-gold-200 hover:bg-red-900/50 hover:text-white transition-colors border border-transparent hover:border-red-800/50"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              )}
              {!user && (
                 <div className="space-x-3 flex items-center">
                    <button onClick={() => navigate('/login')} className="px-5 py-2 text-sm font-bold text-gold-100 hover:text-white hover:bg-white/10 rounded-md transition-all">Login</button>
                    <button onClick={() => navigate('/register')} className="px-6 py-2 text-sm font-bold bg-gradient-to-r from-gold-500 to-saffron-500 hover:from-gold-400 hover:to-saffron-400 text-maroon-900 rounded-md shadow-lg transition-all transform hover:-translate-y-0.5">
                      Join Now
                    </button>
                 </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gold-200 hover:text-white hover:bg-white/10 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-maroon-900 border-t border-gold-600 shadow-2xl">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {user ? (
                <>
                   <div className="px-3 py-3 text-gold-200 font-serif border-b border-white/10 mb-4">
                    Welcome, <span className="text-white font-bold">{user.fullName}</span>
                  </div>
                  {user.role === UserRole.ADMIN ? (
                    <>
                      <button
                        onClick={() => handleNavClick('/admin/products')}
                        className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-white hover:bg-white/10"
                      >
                        Product Management
                      </button>
                      <button
                        onClick={() => handleNavClick('/admin/approvals')}
                        className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-white hover:bg-white/10"
                      >
                        User Approvals
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleNavClick('/buyer/home')}
                      className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-white hover:bg-white/10"
                    >
                      Browse Auctions
                    </button>
                  )}
                  <button
                    onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-300 hover:bg-red-900/30 mt-4"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                 <div className="space-y-3 mt-2">
                  <button onClick={() => handleNavClick('/login')} className="block w-full text-center px-4 py-3 text-base font-bold text-white bg-white/10 rounded-lg">Login</button>
                  <button onClick={() => handleNavClick('/register')} className="block w-full text-center px-4 py-3 text-base font-bold text-maroon-900 bg-gold-500 rounded-lg">Register</button>
                 </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-maroon-950 text-saffron-100 py-8 border-t border-gold-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
             <Gavel className="h-6 w-6 text-gold-600 mr-2" />
             <span className="font-serif font-bold text-lg text-gold-500">MOKSHA</span>
          </div>
          <p className="font-sans text-sm text-saffron-200/60">&copy; 2024 Moksha Bidding Organization. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;