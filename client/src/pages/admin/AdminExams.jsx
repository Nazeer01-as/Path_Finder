import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Award } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';

const AdminExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const initialForm = {
    name: '',
    conductingBody: '',
    category: 'Engineering',
    description: '',
    eligibility: '',
    ageLimit: 'Refer official bulletin',
    applicationStartDate: '',
    applicationLastDate: '',
    examDate: '',
    fee: '₹1000',
    examPattern: 'Computer Based Test (CBT)',
    syllabus: '',
    officialWebsite: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'School-Level',
    'Engineering',
    'Medical',
    'Law',
    'Management',
    'Government / Competitive',
    'Defence',
    'Other'
  ];

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/exams?limit=100&search=${search}`);
      setExams(res.data.data || []);
    } catch (err) {
      console.error('Failed to load exams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [search]);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (exam) => {
    setEditId(exam._id);
    setFormData({
      name: exam.name,
      conductingBody: exam.conductingBody,
      category: exam.category,
      description: exam.description,
      eligibility: exam.eligibility,
      ageLimit: exam.ageLimit || '',
      applicationStartDate: exam.applicationStartDate ? exam.applicationStartDate.split('T')[0] : '',
      applicationLastDate: exam.applicationLastDate ? exam.applicationLastDate.split('T')[0] : '',
      examDate: exam.examDate ? exam.examDate.split('T')[0] : '',
      fee: exam.fee || '',
      examPattern: exam.examPattern || '',
      syllabus: exam.syllabus || '',
      officialWebsite: exam.officialWebsite
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this examination?')) return;
    try {
      await api.delete(`/exams/${id}`);
      fetchExams();
    } catch (err) {
      alert('Failed to delete examination');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      applicationStartDate: formData.applicationStartDate ? new Date(formData.applicationStartDate) : undefined,
      applicationLastDate: formData.applicationLastDate ? new Date(formData.applicationLastDate) : undefined,
      examDate: formData.examDate ? new Date(formData.examDate) : undefined
    };

    try {
      if (editId) {
        await api.put(`/exams/${editId}`, payload);
      } else {
        await api.post('/exams', payload);
      }
      setModalOpen(false);
      fetchExams();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving examination');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Examinations Management
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Maintain database of national, state, and school-level competitive exams.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Examination
        </button>
      </div>

      <div className="bg-stone-900/80 rounded-2xl border border-stone-800 p-3 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exams by name or conducting body..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-hidden transition-colors"
          />
        </div>
      </div>

      <div className="bg-stone-900/80 rounded-2xl border border-stone-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/60 border-b border-stone-800 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Exam Name & Body</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Application Closes</th>
                <th className="px-4 py-3.5">Exam Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-stone-500">
                    Loading examinations...
                  </td>
                </tr>
              ) : exams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-stone-500">
                    No examinations found.
                  </td>
                </tr>
              ) : (
                exams.map((exam) => (
                  <tr key={exam._id} className="hover:bg-stone-800/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-white">{exam.name}</p>
                      <p className="text-[11px] text-stone-400">{exam.conductingBody}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant="purple" size="xs">
                        {exam.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-rose-400">
                      {exam.applicationLastDate ? new Date(exam.applicationLastDate).toLocaleDateString() : 'TBA'}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-stone-200">
                      {exam.examDate ? new Date(exam.examDate).toLocaleDateString() : 'TBA'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(exam)}
                          className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exam._id)}
                          className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
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
        title={editId ? 'Edit Examination' : 'Add New Examination'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
              Examination Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-hidden font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 focus:border-amber-500 outline-hidden font-medium"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-stone-900 text-stone-100">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
                Conducting Body
              </label>
              <input
                type="text"
                required
                value={formData.conductingBody}
                onChange={(e) => setFormData({ ...formData, conductingBody: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-hidden font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
                Eligibility
              </label>
              <input
                type="text"
                required
                value={formData.eligibility}
                onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
                Age Limit
              </label>
              <input
                type="text"
                value={formData.ageLimit}
                onChange={(e) => setFormData({ ...formData, ageLimit: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
                Application Starts
              </label>
              <input
                type="date"
                value={formData.applicationStartDate}
                onChange={(e) => setFormData({ ...formData, applicationStartDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 focus:border-amber-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
                Application Closes
              </label>
              <input
                type="date"
                value={formData.applicationLastDate}
                onChange={(e) => setFormData({ ...formData, applicationLastDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 focus:border-amber-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
                Exam Date
              </label>
              <input
                type="date"
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 focus:border-amber-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
                Application Fee
              </label>
              <input
                type="text"
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
                Official Website
              </label>
              <input
                type="url"
                required
                value={formData.officialWebsite}
                onChange={(e) => setFormData({ ...formData, officialWebsite: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-hidden font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
              Exam Pattern & Syllabus
            </label>
            <input
              type="text"
              value={formData.examPattern}
              onChange={(e) => setFormData({ ...formData, examPattern: e.target.value })}
              placeholder="e.g. CBT mode, 90 MCQs, Physics, Chemistry, Math..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-hidden font-medium"
            />
          </div>

          <div className="pt-4 border-t border-stone-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-stone-800 text-stone-300 hover:bg-stone-800 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editId ? 'Update Exam' : 'Create Exam'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminExams;
