import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoute';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import Landing from './pages/Landing';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Saved from './pages/Saved';

// Explorer Modules & Details
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import Exams from './pages/Exams';
import ExamDetail from './pages/ExamDetail';
import Scholarships from './pages/Scholarships';
import ScholarshipDetail from './pages/ScholarshipDetail';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Careers from './pages/Careers';
import CareerDetail from './pages/CareerDetail';
import NotFound from './pages/NotFound';

// Admin Suite Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOpportunities from './pages/admin/AdminOpportunities';
import AdminExams from './pages/admin/AdminExams';
import AdminScholarships from './pages/admin/AdminScholarships';
import AdminCourses from './pages/admin/AdminCourses';
import AdminCareers from './pages/admin/AdminCareers';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public & Student Application Layout */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Landing />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Explorers (accessible publicly and enhanced with login) */}
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="opportunities/:id" element={<OpportunityDetail />} />
            <Route path="exams" element={<Exams />} />
            <Route path="exams/:id" element={<ExamDetail />} />
            <Route path="scholarships" element={<Scholarships />} />
            <Route path="scholarships/:id" element={<ScholarshipDetail />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="careers" element={<Careers />} />
            <Route path="careers/:id" element={<CareerDetail />} />

            {/* Student Protected Routes */}
            <Route
              path="onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="saved"
              element={
                <ProtectedRoute>
                  <Saved />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>

          {/* Admin Protected Suite */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="opportunities" element={<AdminOpportunities />} />
            <Route path="exams" element={<AdminExams />} />
            <Route path="scholarships" element={<AdminScholarships />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="careers" element={<AdminCareers />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
