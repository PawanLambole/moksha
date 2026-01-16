import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product, Bid, User } from '../../types';
import { mockStore } from '../../services/mockStore';
import { IndianRupee, Clock, AlertCircle, ShieldCheck, TrendingUp, History } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface BiddingPageProps {
  user: User;
}

const BiddingPage: React.FC<BiddingPageProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [graphData, setGraphData] = useState<any[]>([]);

  const fetchData = async () => {
    if (!id) return;
    const p = await mockStore.getProductById(id);
    if (p) {
      setProduct(p);
      if (bidAmount === 0) setBidAmount(p.currentBid + 100);
      
      const b = await mockStore.getBidsForProduct(id);
      setBids(b);

      const data = b.map(bid => ({
        time: new Date(bid.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        amount: bid.amount
      }));
      
      if (data.length === 0) {
        data.push({ time: 'Start', amount: p.basePrice });
      }
      setGraphData(data);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!product || !id) return;

    if (bidAmount <= product.currentBid) {
      setError(`Bid must be higher than ₹${product.currentBid}`);
      return;
    }

    try {
      await mockStore.placeBid(user.id, user.username, id, bidAmount);
      setSuccess('Bid placed successfully!');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!product) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Product Info */}
      <div className="lg:col-span-7 space-y-6">
        <div className="glass-panel p-2 rounded-2xl shadow-xl overflow-hidden bg-white">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-[450px] object-cover rounded-xl hover:scale-[1.01] transition-transform duration-500"
          />
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-maroon-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="w-32 h-32 text-maroon-800" />
          </div>
          
          <h1 className="text-3xl font-serif font-bold text-gray-900 relative z-10">{product.title}</h1>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
             <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1 text-green-600"/> Verified Authentic</span>
             <span>ID: #{product.id}</span>
          </div>

          <p className="mt-6 text-gray-700 leading-relaxed text-lg font-light border-b border-gray-100 pb-6">{product.description}</p>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
             <div className="bg-saffron-50 px-6 py-4 rounded-xl border border-saffron-100">
                <p className="text-xs text-saffron-800 uppercase font-bold tracking-wider mb-1">Base Price</p>
                <p className="text-2xl font-serif font-bold text-gray-800">₹{product.basePrice.toLocaleString()}</p>
             </div>
             <div className="bg-gray-50 px-6 py-4 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Time Remaining</p>
                <p className="text-2xl font-serif font-bold text-gray-800 flex items-center">
                   {new Date(product.endTime).toLocaleDateString()}
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Right Column: Bidding Dashboard */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Bidding Control Panel */}
        <div className="glass-panel p-6 rounded-2xl shadow-xl border border-gold-400/50 bg-gradient-to-b from-white to-saffron-50/30">
          <div className="text-center mb-8 relative">
            <div className="inline-block relative">
               <p className="text-xs text-maroon-600 uppercase tracking-[0.2em] font-bold mb-2">Current Highest Bid</p>
               <h2 className="text-5xl font-serif font-bold text-maroon-900 flex justify-center items-center drop-shadow-sm">
                <IndianRupee className="w-8 h-8 mt-2 text-gold-500" />
                {product.currentBid.toLocaleString()}
               </h2>
               {/* Decorative Ring */}
               <div className="absolute -inset-6 border border-gold-200 rounded-full opacity-50 scale-110"></div>
            </div>
          </div>

          <form onSubmit={handlePlaceBid} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Your Offer</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg font-serif">₹</span>
                </div>
                <input
                  type="number"
                  required
                  className="focus:ring-gold-500 focus:border-gold-500 block w-full pl-8 pr-4 py-4 text-xl font-bold border-gray-300 rounded-lg shadow-inner bg-white"
                  placeholder="0.00"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm flex items-center bg-red-50 p-2 rounded">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="text-green-700 text-sm font-bold flex items-center bg-green-50 p-2 rounded">
                <ShieldCheck className="w-4 h-4 mr-2" />
                {success}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-maroon-800 to-maroon-900 hover:from-maroon-700 hover:to-maroon-800 border border-transparent rounded-lg shadow-lg py-4 px-4 text-lg font-bold text-gold-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon-500 transition-all transform active:scale-95 flex justify-center items-center uppercase tracking-widest"
            >
              Place Official Bid
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">By placing a bid, you agree to the Binding Terms.</p>
          </form>
        </div>

        {/* Real-time Graph */}
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center uppercase tracking-wide">
            <TrendingUp className="w-4 h-4 mr-2 text-saffron-600" />
            Market Activity
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData}>
                <defs>
                  <linearGradient id="colorBid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea4c13" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ea4c13" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #fed7aa', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  labelStyle={{ color: '#9a3412', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#c23510" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorBid)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bids List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center text-gray-600">
            <History className="w-4 h-4 mr-2" />
            <h3 className="font-bold text-xs uppercase tracking-wide">Bid History</h3>
          </div>
          <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
            {bids.slice().reverse().map((bid) => (
              <li key={bid.id} className="px-5 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-700 font-bold text-xs mr-3 border border-saffron-200">
                    {bid.username.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 text-sm block">{bid.username}</span>
                    <p className="text-[10px] text-gray-400">{new Date(bid.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                <span className="font-bold text-maroon-800 font-serif">₹{bid.amount.toLocaleString()}</span>
              </li>
            ))}
            {bids.length === 0 && <li className="px-5 py-4 text-sm text-gray-500 text-center italic">No history available yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BiddingPage;