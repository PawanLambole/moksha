import React, { useEffect, useState } from 'react';
import { Product } from '../../types';
import { mockStore } from '../../services/mockStore';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, Clock, ArrowRight, Star } from 'lucide-react';

const BuyerHome: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    mockStore.getAllProducts().then(setProducts);
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] flex items-center border border-gold-600/30">
         <div className="absolute inset-0 bg-gradient-to-r from-maroon-900 via-maroon-800 to-saffron-900"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30"></div>
         
         {/* Decorative circle */}
         <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl"></div>
         
         <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
           <div className="inline-block mb-4">
             <span className="bg-white/10 backdrop-blur-md border border-gold-400/30 text-gold-300 px-4 py-1 rounded-full text-xs font-bold tracking-[0.2em] uppercase">
                Premium Spiritual Marketplace
             </span>
           </div>
           <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-6 drop-shadow-lg leading-tight">
             Acquire Divine <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-saffron-300">Heritage</span>
           </h1>
           <p className="text-saffron-100/90 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light">
             Participate in exclusive auctions for consecrated artifacts, rare idols, and traditional masterpieces verified by temple trusts.
           </p>
           <button 
             onClick={() => document.getElementById('auctions')?.scrollIntoView({ behavior: 'smooth' })}
             className="bg-gradient-to-r from-gold-500 to-saffron-500 hover:from-gold-400 hover:to-saffron-400 text-maroon-900 font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
           >
             Explore Auctions
           </button>
         </div>
      </div>

      <div id="auctions" className="space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-serif font-bold text-maroon-900 border-l-4 border-gold-500 pl-3">Live Auctions</h2>
           <div className="h-px bg-gold-200 flex-grow mx-4"></div>
           <span className="text-sm text-saffron-700 font-medium">Showing {products.length} Items</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="glass-panel rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full border border-gold-200/50 bg-white">
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10 pointer-events-none"></div>
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                />
                <div className="absolute top-3 right-3 z-20">
                  <span className="bg-maroon-900/90 text-white text-xs px-3 py-1.5 rounded-full flex items-center backdrop-blur-md shadow-md font-bold tracking-wide border border-white/20">
                     <Clock className="w-3 h-3 mr-1.5 text-gold-400" />
                     {Math.floor((new Date(product.endTime).getTime() - Date.now()) / (1000 * 60 * 60))}h Left
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col relative">
                <div className="absolute -top-6 right-4 bg-white p-2 rounded-full shadow-lg border border-gray-100">
                    <button className="text-gray-400 hover:text-gold-500 transition-colors">
                        <Star className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-2">
                   <h3 className="text-lg font-serif font-bold text-gray-900 leading-tight group-hover:text-saffron-700 transition-colors">{product.title}</h3>
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 font-light">{product.description}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Current Bid</p>
                      <p className="text-xl font-bold text-maroon-800 flex items-center font-serif">
                        <IndianRupee className="w-4 h-4 mr-0.5" />
                        {product.currentBid.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/buyer/product/${product.id}`)}
                      className="group-hover:bg-maroon-900 bg-gray-900 text-white p-2.5 rounded-lg transition-colors shadow-lg flex items-center text-xs font-bold uppercase tracking-wider pl-4"
                    >
                      Bid <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerHome;