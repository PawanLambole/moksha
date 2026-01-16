import React, { useEffect, useState } from 'react';
import { Product } from '../../types';
import { mockStore } from '../../services/mockStore';
import { Plus, Clock, IndianRupee, MoreVertical, Edit2 } from 'lucide-react';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    basePrice: '',
    imageUrl: '',
    durationHours: '24',
  });

  const fetchProducts = async () => {
    const data = await mockStore.getAllProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const endTime = new Date(Date.now() + parseInt(newProduct.durationHours) * 3600000).toISOString();
    
    await mockStore.addProduct({
      title: newProduct.title,
      description: newProduct.description,
      basePrice: parseFloat(newProduct.basePrice),
      imageUrl: newProduct.imageUrl || `https://picsum.photos/400/300?random=${Date.now()}`,
      endTime: endTime,
    });
    
    setShowAddModal(false);
    setNewProduct({ title: '', description: '', basePrice: '', imageUrl: '', durationHours: '24' });
    fetchProducts();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-serif font-bold text-maroon-900">Inventory Management</h1>
          <p className="text-sm text-gray-500">Manage your catalog of spiritual artifacts</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gold-500 text-maroon-900 font-bold px-6 py-2.5 rounded-lg hover:bg-gold-400 flex items-center shadow-md transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          List New Artifact
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 flex flex-col group">
            <div className="h-52 overflow-hidden bg-gray-100 relative">
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 right-2">
                 <button className="p-1.5 bg-white/90 rounded-full hover:bg-white text-gray-600 hover:text-maroon-600 transition-colors shadow-sm">
                   <MoreVertical size={16} />
                 </button>
              </div>
            </div>
            <div className="p-5 flex-grow">
              <div className="flex justify-between items-start mb-2">
                 <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.title}</h3>
                 <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ${product.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600'}`}>
                    {product.status}
                 </span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{product.description}</p>
              
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase">Current</span>
                  <div className="flex items-center text-maroon-700 font-bold">
                    <IndianRupee className="h-3 w-3 mr-0.5" />
                    {product.currentBid.toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400 font-bold uppercase">Closes</span>
                  <div className="flex items-center text-gray-600 font-medium text-sm">
                    {new Date(product.endTime).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-maroon-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl transform transition-all">
            <h2 className="text-2xl font-serif font-bold mb-6 text-maroon-900 border-b pb-2">List New Item</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Title</label>
                <input
                  className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-gold-500 focus:border-gold-500"
                  placeholder="e.g. Antique Brass Idol"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                <textarea
                  className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-gold-500 focus:border-gold-500 min-h-[100px]"
                  placeholder="Provide historical context and details..."
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>
              <div className="flex space-x-4">
                 <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Base Price (₹)</label>
                    <input
                        type="number"
                        className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-gold-500 focus:border-gold-500"
                        placeholder="5000"
                        required
                        value={newProduct.basePrice}
                        onChange={(e) => setNewProduct({...newProduct, basePrice: e.target.value})}
                      />
                 </div>
                  <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Duration</label>
                      <select 
                        className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-gold-500 focus:border-gold-500"
                        value={newProduct.durationHours}
                        onChange={(e) => setNewProduct({...newProduct, durationHours: e.target.value})}
                      >
                          <option value="24">24 Hours</option>
                          <option value="48">48 Hours</option>
                          <option value="72">3 Days</option>
                          <option value="168">1 Week</option>
                      </select>
                  </div>
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Image URL</label>
                 <input
                    className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-gold-500 focus:border-gold-500"
                    placeholder="https://..."
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                 />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-maroon-800 to-maroon-900 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;