import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { UserCheck, Clock, MessageSquare, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DoctorDashboard() {
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const stats = [
    { label: "Today's Patients", value: "12", icon: UserCheck, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Requests", value: "5", icon: Clock, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Total Feedback", value: "4.8/5", icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/appointments/doctor/stats');
        const formatted = Object.entries(response.data).map(([date, count]) => ({
          day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          height: Math.min(count * 20, 100)
        }));
        setGraphData(formatted);
      } catch (err) {
        console.error("Failed to fetch doctor stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-10 animate-page">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Doctor Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your consultations and patient health records.</p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-2xl border border-emerald-100 font-bold text-sm shadow-sm">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
          Duty Status: Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-500/5 group">
            <div className={`${s.bg} ${s.color} p-4 rounded-2xl w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <s.icon size={26} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Patient Inflow Overview</h3>
            <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                <TrendingUp size={20} />
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-4">
            {loading ? (
              <div className="w-full flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" /></div>
            ) : graphData.length > 0 ? (
              graphData.map((d, i) => (
                <div key={i} className="flex-1 bg-slate-100 rounded-t-2xl relative group cursor-pointer flex flex-col justify-end">
                   <div
                    className="w-full bg-blue-600 rounded-t-2xl transition-all duration-700 group-hover:bg-blue-400"
                    style={{ height: `${d.height}%` }}
                   ></div>
                   <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase">{d.day}</span>
                </div>
              ))
            ) : (
              <p className="w-full text-center text-slate-400 text-sm">No data available for this week.</p>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold leading-tight">Your Next <br/>Consultation</h3>
            <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <Calendar className="text-blue-400" />
                    <div>
                        <p className="text-xs font-bold text-slate-500">Scheduled Today</p>
                        <p className="font-bold text-sm">Check "My Appointments" for details.</p>
                    </div>
                </div>
            </div>
            <button
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white w-full py-4 rounded-2xl font-bold transition-all"
              onClick={() => navigate('/doctor/appointments')}
            >
              View All Appointments
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>
      </div>
    </div>
  );
}