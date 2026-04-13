import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Home, ClipboardList, PlusCircle, User, FileText,
  LogOut, Activity, ChevronRight, History, MessageSquare
} from 'lucide-react';

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role") || "PATIENT";

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = {
      PATIENT: [
        { name: 'Home Page', icon: Home, path: '/patient/dashboard' },
        { name: 'My Bookings', icon: ClipboardList, path: '/patient/bookings' },
        { name: 'Book Appointment', icon: PlusCircle, path: '/patient/book' },
        { name: 'Profile', icon: User, path: '/patient/profile' },
        // FIXED: Path must match App.jsx exactly
        { name: 'Medical Records', icon: FileText, path: '/patient/medical-records' },
      ],
    DOCTOR: [
      { name: 'Home Page', icon: Home, path: '/doctor/dashboard' },
      { name: 'Consultations', icon: Activity, path: '/doctor/consultations' },
      { name: 'Pending Requests', icon: ClipboardList, path: '/doctor/pending' },
      { name: 'History', icon: History, path: '/doctor/history' },
      { name: 'Feedbacks', icon: MessageSquare, path: '/doctor/feedbacks' },
      { name: 'Profile', icon: User, path: '/doctor/profile' },
    ]
  };

  const currentMenu = menuItems[role] || [];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-slate-900 text-white transition-all duration-500 ease-in-out z-40 border-r border-slate-800 flex flex-col pt-24
        ${isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'}`}
    >
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto no-scrollbar">
        {currentMenu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center group transition-all duration-300 rounded-2xl px-4 py-3.5
                ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
            >
              <item.icon size={22} className={`shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110 transition-transform'}`} />
              <span className={`ml-4 font-bold text-sm whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                {item.name}
              </span>
              {isActive && isOpen && <ChevronRight size={16} className="ml-auto opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-4 py-4 text-slate-400 hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all font-bold group"
        >
          <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          <span className={`transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}