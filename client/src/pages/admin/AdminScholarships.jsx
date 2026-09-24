import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, BookOpen } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';

const AdminScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const initialForm = {
    name: '',
    provider: '',
    description: '',
    eligibility: '',
    benefits: '₹50,000 per year',
    incomeCriteria: 'Annual family income <= ₹8,00,000',
    categoryCriteria: 'All Categories',
    state: 'All India',
    deadline: '',
    officialWebsite: '',
    requiredDocuments: 'Income certificate, Marksheets, Identity proof'
  };

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/scholarships?limit=100&search=${search}`);
      setScholarships(res.data.data || []);
    } catch (err) {
      console.error('Failed to load scholarships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [search]);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (sch) => {
    setEditId(sch._id);
    setFormData({
      name: sch.name,
      provider: sch.provider,
      description: sch.description,
      eligibility: sch.eligibility,
      benefits: sch.benefits,
      incomeCriteria: sch.incomeCriteria || '',
      categoryCriteria: sch.categoryCriteria || 'All Categories',
      state: sch.state || 'All India',
      deadline: sch.deadline ? sch.deadline.split('T')[0] : '',
      officialWebsite: sch.officialWebsite,
      requiredDocuments: (sch.requiredDocuments || []).join(', ')
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scholarship?')) return;
    try {
      await api.delete(`/scholarships/${id}`);
      fetchScholarships();
    } catch (err) {
      alert('Failed to delete scholarship');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      requiredDocuments: formData.requiredDocuments.split(',').map((s) => s.trim()).filter(Boolean),
      deadline: formData.deadline ? new Date(formData.deadline) : undefined
    };

    try {
      if (editId) {
        await api.put(`/scholarships/${editId}`, payload);
      } else {
        await api.post('/scholarships', payload);
      }
      setModalOpen(false);
      fetchScholarships();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving scholarship');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Scholarships Management
          </h1>
          <p className="text-xs text-slate-500">
            Maintain national, corporate, and state student grant programs.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Scholarship
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scholarships by name or provider..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Scholarship & Provider</th>
                <th className="px-4 py-3.5">Benefit Amount</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Deadline</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    Loading scholarships...
                  </td>
                </tr>
              ) : scholarships.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No scholarships found.
                  </td>
                </tr>
              ) : (
                scholarships.map((sch) => (
                  <tr key={sch._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900">{sch.name}</p>
                      <p className="text-[11px] text-slate-400">{sch.provider}</p>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600">{sch.benefits}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant="emerald" size="xs">
                        {sch.categoryCriteria || 'General'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 font-medium">
                      {sch.deadline ? new Date(sch.deadline).toLocaleDateString() : 'Active'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(sch)}
                          className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sch._id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Scholarship' : 'Add New Scholarship'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Scholarship Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Provider / Organization
              </label>
              <input
                type="text"
                required
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Grant / Benefit Amount
              </label>
              <input
                type="text"
                required
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                placeholder="e.g. ₹50,000 per year"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Eligibility Criteria
              </label>
              <input
                type="text"
                required
                value={formData.eligibility}
                onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Income Criteria
              </label>
              <input
                type="text"
                value={formData.incomeCriteria}
                onChange={(e) => setFormData({ ...formData, incomeCriteria: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Website
              </label>
              <input
                type="url"
                required
                value={formData.officialWebsite}
                onChange={(e) => setFormData({ ...formData, officialWebsite: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Required Documents (Comma separated)
            </label>
            <input
              type="text"
              value={formData.requiredDocuments}
              onChange={(e) => setFormData({ ...formData, requiredDocuments: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editId ? 'Update Scholarship' : 'Create Scholarship'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminScholarships;
