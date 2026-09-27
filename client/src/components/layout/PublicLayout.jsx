import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = () => {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';
  const showFooter = normalizedPath === '/' || normalizedPath === '/about';

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0a] text-stone-100 selection:bg-amber-500 selection:text-stone-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default PublicLayout;
