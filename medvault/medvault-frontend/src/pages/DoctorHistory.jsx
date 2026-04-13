import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { History, User, Calendar, CheckCircle, XCircle, FileText, Search, Loader2 } from 'lucide-react';

export default function DoctorHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/api/doctor/appointments');
        // Filter for both COMPLETED and REJECTED to show full history
        const pastData = response.data.filter(app =>
          app.status === 'COMPLETED' || app.status === 'REJECTED'
        );
        setHistory(pastData);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item =>
    item.patient.user.fullName.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-page">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <History className="text-blue-600" size={32} /> Consultation History
          </h1>
          <p className="text-slate-500 font-medium mt-1">Access records of all past patient interactions.</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search patient records..."
            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 w-72 text-sm font-bold shadow-sm"
            onChange={(e) => setFilter(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-sm">
          <FileText size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-xl font-bold text-slate-800">No records found</h3>
          <p className="text-slate-400">Your completed consultations will be archived here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                        <User size={18} />
                      </div>
                      <span className="font-bold text-slate-700">{item.patient.user.fullName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-600">{item.appointmentDate}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{item.appointmentTime}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                      item.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {item.status === 'COMPLETED' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {item.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-xs font-mono text-slate-300">#MV-{item.id}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}