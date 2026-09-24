import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Briefcase, TrendingUp } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';

const AdminCareers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const initialForm = {
    title: '',
    sector: 'Information Technology',
    description: '',
    averageSalaryRange: '₹6,00,000 - ₹20,00,000 per annum',
    growthProspects: 'High Market Demand',
    requiredEducation: 'Class 10, Intermediate (PCM), B.Tech',
    requiredSkills: 'Analytical Thinking, Coding, System Design',
    jobRoles: 'Junior Engineer, Senior Architect, Lead'
  };

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/careers?limit=100&search=${search}`);
      setCareers(res.data.data || []);
    } catch (err) {
      console.error('Failed to load careers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, [search]);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (career) => {
    setEditId(career._id);
    setFormData({
      title: career.title,
      sector: career.sector,
      description: career.description,
      averageSalaryRange: career.averageSalaryRange || '',
      growthProspects: career.growthProspects || '',
      requiredEducation: (career.requiredEducation || []).join(', '),
      requiredSkills: (career.requiredSkills || []).join(', '),
      jobRoles: (career.jobRoles || []).join(', ')
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this career pathway?')) return;
    try {
      await api.delete(`/careers/${id}`);
      fetchCareers();
    } catch (err) {
      alert('Failed to delete career pathway');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      requiredEducation: formData.requiredEducation.split(',').map((s) => s.trim()).filter(Boolean),
      requiredSkills: formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      jobRoles: formData.jobRoles.split(',').map((s) => s.trim()).filter(Boolean),
      // Set default structured 4-step path if empty
      careerPath: [
        { stepNumber: 1, title: 'Class 10 Board', description: 'Foundation in science & mathematics.', typicalDuration: 'Class 10' },
        { stepNumber: 2, title: 'Higher Secondary / Diploma', description: 'Specialized stream foundation.', typicalDuration: '2 - 3 Years' },
        { stepNumber: 3, title: 'Undergraduate Degree', description: 'College education & project mastery.', typicalDuration: '3 - 4 Years' },
        { stepNumber: 4, title: 'Professional Career', description: 'Industry role & leadership.', typicalDuration: 'Full Time' }
      ]
    };

    try {
      if (editId) {
        await api.put(`/careers/${editId}`, payload);
      } else {
        await api.post('/careers', payload);
      }
      setModalOpen(false);
      fetchCareers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving career');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Career Pathways Management
          </h1>
          <p className="text-xs text-slate-500">
            Design interactive step-by-step career blueprints and trajectory paths.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Career Blueprint
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search careers by title or sector..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Career Title</th>
                <th className="px-4 py-3.5">Sector</th>
                <th className="px-4 py-3.5">Compensation</th>
                <th className="px-4 py-3.5">Growth Outlook</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    Loading careers...
                  </td>
                </tr>
              ) : careers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No careers found.
                  </td>
                </tr>
              ) : (
                careers.map((career) => (
                  <tr key={career._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{career.title}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant="purple" size="xs">
                        {career.sector}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 font-medium">{career.averageSalaryRange}</td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600 flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {career.growthProspects}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(career)}
                          className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(career._id)}
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
        title={editId ? 'Edit Career Blueprint' : 'Add New Career Blueprint'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Career Title
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
                Sector / Industry
              </label>
              <input
                type="text"
                required
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Average Salary Range
              </label>
              <input
                type="text"
                value={formData.averageSalaryRange}
                onChange={(e) => setFormData({ ...formData, averageSalaryRange: e.target.value })}
                placeholder="e.g. ₹6,00,000 - ₹18,00,000 per annum"
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
                Market Growth Outlook
              </label>
              <input
                type="text"
                value={formData.growthProspects}
                onChange={(e) => setFormData({ ...formData, growthProspects: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Typical Job Titles (Comma separated)
              </label>
              <input
                type="text"
                value={formData.jobRoles}
                onChange={(e) => setFormData({ ...formData, jobRoles: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Required Education Milestones (Comma separated)
            </label>
            <input
              type="text"
              value={formData.requiredEducation}
              onChange={(e) => setFormData({ ...formData, requiredEducation: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Key Skills Required (Comma separated)
            </label>
            <input
              type="text"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
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
              {submitting ? 'Saving...' : editId ? 'Update Blueprint' : 'Create Blueprint'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCareers;
