import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Activity, CheckCircle, User, Calendar, Clock, Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DoctorConsultations() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchConsultations = async () => {
      try {
        const response = await api.get('/api/doctor/appointments');
        const active = response.data.filter(app => app.status === 'PAID');
        setConsultations(active);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    fetchConsultations();
  }, []);

  // UPDATED: Now navigates to a dedicated page instead of opening a modal
  const handleOpenPrescription = (id) => {
    navigate(`/doctor/prescription/${id}`);
  };

  const filtered = consultations.filter(c => {
      const patientName = c.patient?.user?.fullName || "";
      return patientName.toLowerCase().includes(searchTerm.toLowerCase());
    });

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-page relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Activity className="text-blue-600" size={32} /> Active Consultations
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage your current patient queue and ongoing treatments.</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search patient name..."
            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 w-64 text-sm font-bold"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-200 mb-4">
            <User size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No active consultations</h3>
          <p className="text-slate-400">Once you approve a pending request, it will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((con) => (
            <div key={con.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-200 transition-all">
              <div className="flex items-center gap-5 flex-1">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200">
                  <User size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{con.patient.user.fullName}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                      <Calendar size={12} /> {con.appointmentDate}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                      <Clock size={12} /> {con.appointmentTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Reason</p>
                <p className="text-sm font-bold text-slate-600 line-clamp-1">"{con.reason}"</p>
              </div>

              <button
                onClick={() => handleOpenPrescription(con.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                <CheckCircle size={18} /> Mark Complete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}