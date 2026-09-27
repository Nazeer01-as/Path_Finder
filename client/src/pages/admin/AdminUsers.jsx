import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, UserCheck, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import Badge from '../../components/common/Badge';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?limit=100&search=${search}`);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setFeedback(`Successfully changed user role to ${newRole}`);
      setTimeout(() => setFeedback(''), 3500);
      fetchUsers();
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            User Directory & Access Control
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            View registered student profiles and manage administrator role permissions.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 p-3 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="bg-stone-900/80 rounded-2xl border border-stone-800 p-3 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email address..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-hidden transition-colors"
          />
        </div>
      </div>

      <div className="bg-stone-900/80 rounded-2xl border border-stone-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/60 border-b border-stone-800 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-4 py-3.5">Education Level</th>
                <th className="px-4 py-3.5">Stream / Major</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Joined Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-stone-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-stone-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-stone-800/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="text-[11px] text-stone-400">{u.email}</p>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-stone-200">{u.educationLevel || 'Not specified'}</td>
                    <td className="px-4 py-3.5 text-stone-400">{u.stream || 'General'}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          u.role === 'admin'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-stone-800 text-stone-300 border border-stone-700'
                        }`}
                      >
                        {u.role === 'admin' && <Shield className="w-3 h-3" />}
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-stone-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleRoleToggle(u._id, u.role)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                          u.role === 'admin'
                            ? 'text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20'
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20'
                        }`}
                      >
                        {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
