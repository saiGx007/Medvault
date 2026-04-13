import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // CRITICAL IMPORT
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden">
      <Navbar onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1 relative">
        <Sidebar isOpen={isSidebarOpen} />

        <main
          className={`flex-1 h-[calc(100vh-80px)] overflow-y-auto p-6 md:p-10 transition-all duration-500 ease-in-out
            ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}
        >
          <div className="max-w-6xl mx-auto pb-12">
            {/* FIX: Use Outlet to render the nested Profile/Dashboard routes */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}