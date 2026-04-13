import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Clock, Check, X, User, AlertCircle, Calendar, MessageSquare, Loader2 } from 'lucide-react';

export default function DoctorPendingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/api/doctor/appointments');
      // Show both initial requests and those waiting for payment
      const pendingList = response.data.filter(app =>
        app.status === 'PENDING' || app.status === 'APPROVED'
      );
      setRequests(pendingList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await api.post(`/api/doctor/${action}/${id}`);
      alert(`Appointment ${action}ed successfully!`);
      fetchRequests(); // Refresh list
    } catch (err) {
      alert("Failed to process request.");
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-page">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pending Consultations</h1>
        <p className="text-slate-500 font-medium mt-1">Review and manage incoming patient requests.</p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 mb-4">
            <Clock size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No pending requests</h3>
          <p className="text-slate-400">All caught up! New requests will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center gap-8 group hover:border-blue-200 transition-all">

              {/* Patient Info */}
              <div className="flex items-center gap-5 min-w-[250px]">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{req.patient.user.fullName}</h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                    <Calendar size={14} /> {req.appointmentDate}
                  </div>
                </div>
              </div>

              {/* Problem/Reason */}
              <div className="flex-1 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <MessageSquare size={14} /> Patient's Concern
                </p>
                <p className="text-slate-700 font-medium italic">"{req.reason}"</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                {req.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => handleAction(req.id, 'reject')}
                      className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                    >
                      <X size={24} />
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'approve')}
                      className="px-8 py-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 font-bold flex items-center gap-2"
                    >
                      <Check size={24} /> Accept Patient
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <div className="px-6 py-3 bg-amber-50 text-amber-600 border border-amber-200 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
                      <Clock size={16} /> Payment Pending
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mr-2">Waiting for patient action</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}