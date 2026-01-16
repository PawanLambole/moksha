import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import { mockStore } from '../../services/mockStore';
import { Check, X, Loader2, User as UserIcon, Calendar } from 'lucide-react';

const UserApproval: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const users = await mockStore.getPendingUsers();
    setPendingUsers(users);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id: string) => {
    await mockStore.approveUser(id);
    fetchUsers();
  };

  const handleReject = async (id: string) => {
    await mockStore.rejectUser(id);
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-saffron-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h1 className="text-2xl font-serif font-bold text-maroon-900">Member Approvals</h1>
          <p className="text-sm text-gray-500">Verify identity and grant access to the sanctuary.</p>
        </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {pendingUsers.length === 0 ? (
          <div className="p-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
                <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
            <p className="text-gray-500">No pending registration requests at the moment.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {pendingUsers.map((user) => (
              <li key={user.id} className="p-6 hover:bg-saffron-50/30 transition-colors">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-4 border border-gray-200 text-gray-400">
                        <UserIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-maroon-900">{user.fullName}</h3>
                      <div className="text-sm text-gray-500 space-y-1 mt-1">
                        <p className="flex items-center"><span className="font-semibold text-gray-700 w-20">Username:</span> {user.username}</p>
                        <p className="flex items-center"><span className="font-semibold text-gray-700 w-20">Mobile:</span> {user.mobile}</p>
                        <p className="flex items-center text-xs text-gray-400 mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            Registered: {new Date(user.createdAt).toLocaleDateString()} {new Date(user.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleReject(user.id)}
                      className="inline-flex items-center px-4 py-2 border border-red-200 text-sm font-bold rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all hover:-translate-y-0.5"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve Access
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserApproval;