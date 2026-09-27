import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, GraduationCap } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const initialForm = {
    name: '',
    category: 'Engineering',
    duration: '4 Years',
    eligibility: '',
    skills: 'Problem Solving, Programming',
    careerOptions: 'Software Engineer, Analyst',
    entranceExams: 'JEE Main, State CET'
  };

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Engineering',
    'Computer Science',
    'AI & ML',
    'Data Science',
    'Medicine',
    'Pharmacy',
    'Law',
    'Commerce',
    'Management',
    'Arts',
    'Design',
    'Agriculture',
    'Vocational',
    'ITI',
    'Diploma',
    'Certification'
  ];

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses?limit=100&search=${search}`);
      setCourses(res.data.data || []);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search]);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditId(course._id);
    setFormData({
      name: course.name,
      category: course.category,
      duration: course.duration,
      eligibility: course.eligibility,
      skills: (course.skills || []).join(', '),
      careerOptions: (course.careerOptions || []).join(', '),
      entranceExams: (course.entranceExams || []).join(', ')
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      fetchCourses();
    } catch (err) {
      alert('Failed to delete course');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      careerOptions: formData.careerOptions.split(',').map((s) => s.trim()).filter(Boolean),
      entranceExams: formData.entranceExams.split(',').map((s) => s.trim()).filter(Boolean)
    };

    try {
      if (editId) {
        await api.put(`/courses/${editId}`, payload);
      } else {
        await api.post('/courses', payload);
      }
      setModalOpen(false);
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Courses Management
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Maintain degree, diploma, vocational, and certification programs.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      <div className="bg-stone-900/80 rounded-2xl border border-stone-800 p-3 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses by name or skill..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-hidden transition-colors"
          />
        </div>
      </div>

      <div className="bg-stone-900/80 rounded-2xl border border-stone-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/60 border-b border-stone-800 text-stone-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Course Name</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Duration</th>
                <th className="px-4 py-3.5">Skills Learned</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-stone-500">
                    Loading courses...
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-stone-500">
                    No courses found.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id} className="hover:bg-stone-800/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white">{course.name}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant="primary" size="xs">
                        {course.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-stone-300">{course.duration}</td>
                    <td className="px-4 py-3.5 text-stone-400">
                      <span className="line-clamp-1">{(course.skills || []).slice(0, 3).join(', ')}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(course)}
                          className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
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
        title={editId ? 'Edit Course' : 'Add New Course'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
              Course Name
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
                Duration
              </label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 4 Years / 3 Years"
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-hidden font-medium"
              />
            </div>
          </div>

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
              Skills Learned (Comma separated)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
              Career Options (Comma separated)
            </label>
            <input
              type="text"
              value={formData.careerOptions}
              onChange={(e) => setFormData({ ...formData, careerOptions: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-800 bg-stone-900 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
              Primary Entrance Exams (Comma separated)
            </label>
            <input
              type="text"
              value={formData.entranceExams}
              onChange={(e) => setFormData({ ...formData, entranceExams: e.target.value })}
              placeholder="e.g. JEE Main, NEET, POLYCET"
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
              {submitting ? 'Saving...' : editId ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCourses;
