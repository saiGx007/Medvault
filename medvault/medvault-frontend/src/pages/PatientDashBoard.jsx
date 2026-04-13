import React, { useState, useEffect } from 'react';
import { Heart, Activity, Clock, Star, ArrowRight, User, Loader2, FileText, CheckCircle2 } from 'lucide-react'; // Added CheckCircle2
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function PatientDashboard() {
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const stats = [
    { label: "Heart Rate", value: "72 bpm", sub: "Normal", color: "bg-rose-500", icon: Heart },
    { label: "Blood Sugar", value: "110 mg/dL", sub: "Healthy", color: "bg-blue-500", icon: Activity },
    { label: "Last Checkup", value: "Jan 12", sub: "5 days ago", color: "bg-amber-500", icon: Clock },
    { label: "Health Score", value: "A+", sub: "Top 5%", color: "bg-emerald-500", icon: Star },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/appointments/patient/my-bookings');
        const latest = response.data
          .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
          .slice(0, 3);
        setRecentAppointments(latest);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-10 animate-page">
      {/* Welcome Banner */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Welcome back, <span className="text-blue-600">M Sai Ganesh!</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Managing your healthcare at MedVault.</p>
        </div>
        <button
          onClick={() => navigate('/patient/medical-records')}
          className="flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl border border-blue-100 font-bold text-sm shadow-sm hover:bg-blue-100 transition-all group"
        >
          <FileText size={18} className="group-hover:rotate-12 transition-transform" />
          View My Prescriptions
        </button>
      </header>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
            <div className={`${s.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${s.color}/20 group-hover:scale-110 transition-transform`}>
              <s.icon className="text-white" size={26} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Recent Appointments</h3>
            <button onClick={() => navigate('/patient/appointments')} className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-2">
              See All <ArrowRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin text-blue-600" />
              </div>
            ) : recentAppointments.length > 0 ? (
              recentAppointments.map((apt) => (
                <AppointmentRow
                  key={apt.id}
                  id={apt.id}
                  name={`Dr. ${apt.doctor.user.fullName}`}
                  type={apt.doctor.specialization}
                  date={`${apt.appointmentDate}, ${apt.appointmentTime}`}
                  status={apt.status}
                  navigate={navigate} // Pass navigate to handle feedback click
                />
              ))
            ) : (
              <p className="text-slate-400 italic text-center py-10">No recent appointments found.</p>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold leading-tight">Need a <br/>Checkup?</h3>
            <p className="text-slate-400 mt-4 text-sm leading-relaxed">Book a consultation with our verified specialists now.</p>
            <button
               onClick={() => navigate('/patient/book-appointment')}
               className="mt-8 bg-blue-600 hover:bg-blue-700 text-white w-full py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/30 active:scale-95"
            >
              Book Appointment
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>
      </div>
    </div>
  );
}

function AppointmentRow({ id, name, type, date, status, navigate }) {
  const isCompleted = status === 'COMPLETED';
  const statusColor = isCompleted ? 'text-emerald-600' : 'text-amber-600'; // Changed to emerald for clarity

  return (
    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-200 hover:bg-white transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors border border-slate-200">
          <User size={20} />
        </div>
        <div>
          <p className="font-bold text-slate-800">{name}</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-500 font-medium">{type}</p>
            {isCompleted && (
               <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                 <CheckCircle2 size={10} /> Prescription Ready
               </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800">{date}</p>
          <p className={`text-[10px] font-black uppercase tracking-tighter mt-1 ${statusColor}`}>
            {status}
          </p>
        </div>

        {/* FEEDBACK BUTTON: Only triggers if status is COMPLETED */}
        {isCompleted ? (
          <button
            onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                navigate(`/patient/feedback/${id}`); // Adjust this path to match your existing feedback route
            }}
            className="bg-amber-100 text-amber-700 p-2.5 rounded-xl hover:bg-amber-200 transition-all shadow-sm hover:scale-110 active:scale-90"
            title="Give Feedback"
          >
            <Star size={18} fill="currentColor" />
          </button>
        ) : (
          <div className="w-10 h-10 flex items-center justify-center text-slate-300" title="Feedback locked until prescription is sent">
             <Star size={18} className="opacity-20" />
          </div>
        )}
      </div>
    </div>
  );
}