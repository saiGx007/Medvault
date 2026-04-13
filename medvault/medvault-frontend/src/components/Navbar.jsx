import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, User, Activity } from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    // FALLBACK LOGIC: If state is null, check storage directly before alerting
    const storedUser = localStorage.getItem('user');
    const activeUser = user || (storedUser ? JSON.parse(storedUser) : null);

    if (!activeUser || !activeUser.role) {
      alert("Session expired. Please login again.");
      return;
    }

    const rolePath = activeUser.role.toLowerCase();
    navigate(`/${rolePath}/profile`);
  };

  return (
    <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="p-3 bg-slate-50 text-slate-600 rounded-2xl border border-slate-100">
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-3 ml-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Activity size={20} className="text-white" />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tighter">MedVault</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portal Access</p>
          <p className="text-sm font-bold text-slate-700">
            {user?.role || (localStorage.getItem('role')) || 'User'}
          </p>
        </div>
        <button
          onClick={handleProfileClick}
          className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
        >
          <User size={20} />
        </button>
      </div>
    </nav>
  );
}