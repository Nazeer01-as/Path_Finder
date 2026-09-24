import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, ExternalLink, Sparkles } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';

const AdminOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const initialForm = {
    title: '',
    description: '',
    category: 'Education',
    organization: '',
    educationLevels: 'Class 10, Intermediate / 11th–12th',
    eligibility: '',
    location: 'All India / Online',
    deadline: '',
    officialWebsite: '',
    tags: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Education',
    'Entrance Exams',
    'Competitive Exams',
    'Scholarships',
    'Internships',
    'Jobs',
    'Skill Development',
    'Certifications',
    'Fellowships',
    'Study Abroad',
    'Government Programs',
    'Private Opportunities',
    'Entrepreneurship',
    'Career Programs'
  ];

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/opportunities?limit=100&search=${search}`);
      setOpportunities(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [search]);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (opp) => {
    setEditId(opp._id);
    setFormData({
      title: opp.title,
      description: opp.description,
      category: opp.category,
      organization: opp.organization,
      educationLevels: (opp.educationLevels || []).join(', '),
      eligibility: opp.eligibility,
      location: opp.location || 'All India',
      deadline: opp.deadline ? opp.deadline.split('T')[0] : '',
      officialWebsite: opp.officialWebsite,
      tags: (opp.tags || []).join(', ')
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      await api.delete(`/opportunities/${id}`);
      fetchOpportunities();
    } catch (err) {
      alert('Failed to delete opportunity');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      educationLevels: formData.educationLevels.split(',').map((s) => s.trim()).filter(Boolean),
      tags: formData.tags.split(',').map((s) => s.trim()).filter(Boolean),
      deadline: formData.deadline ? new Date(formData.deadline) : undefined
    };

    try {
      if (editId) {
        await api.put(`/opportunities/${editId}`, payload);
      } else {
        await api.post('/opportunities', payload);
      }
      setModalOpen(false);
      fetchOpportunities();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving opportunity');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Opportunities Management
          </h1>
          <p className="text-xs text-slate-500">
            Create, update, and manage student opportunity listings.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Opportunity
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search opportunities by title or organization..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Title & Organization</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Deadline</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    Loading opportunities...
                  </td>
                </tr>
              ) : opportunities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No opportunities found.
                  </td>
                </tr>
              ) : (
                opportunities.map((opp) => (
                  <tr key={opp._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900">{opp.title}</p>
                      <p className="text-[11px] text-slate-400">{opp.organization}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant="cyan" size="xs">
                        {opp.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">{opp.location || 'All India'}</td>
                    <td className="px-4 py-3.5 font-medium">
                      {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'Rolling'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(opp)}
                          className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(opp._id)}
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Opportunity' : 'Add New Opportunity'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden bg-white font-medium"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Conducting Organization
              </label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Eligibility Details
            </label>
            <input
              type="text"
              required
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Education Levels (Comma separated)
              </label>
              <input
                type="text"
                value={formData.educationLevels}
                onChange={(e) => setFormData({ ...formData, educationLevels: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
              />
            </div>

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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Website URL
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
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. Space, Python, Government, Stipend"
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
              {submitting ? 'Saving...' : editId ? 'Update Opportunity' : 'Create Opportunity'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminOpportunities;
