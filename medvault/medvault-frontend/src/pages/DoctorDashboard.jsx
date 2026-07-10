import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { UserCheck, Clock, MessageSquare, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DoctorDashboard() {
  const [graphData, setGraphData] = useState([]);
  const [liveStats, setLiveStats] = useState({ todayPatients: 0, pendingRequests: 0, averageFeedback: "4.8/5" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatsAndMetrics = async () => {
      try {
        // 1. Fetch live metrics from appointment history map
        const statsResponse = await api.get('/api/appointments/doctor/stats');
        const data = statsResponse.data;

        console.log("MedVault Backend Stats Received:", data);

        // 2. PROCESS LINE CHART VECTOR POINTS: Process {"2026-07-11": 1} directly
        if (data && Object.keys(data).length > 0) {
          const entries = Object.entries(data);
          const formatted = entries.map(([dateStr, count]) => {
            const parts = dateStr.split('-');
            let dayLabel = "Day";

            if (parts.length === 3) {
              const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
              dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            } else {
              dayLabel = dateStr;
            }

            return {
              day: dayLabel,
              // Percentage calculation for the vertical position of the point (inverted for SVG coordinates)
              yPosition: Math.max(10, 90 - Math.min(count * 50, 80)),
              count: count
            };
          });

          setGraphData(formatted);
        }

        // 3. Calculate total patients seen
        const totalPatientsCount = Object.values(data || {}).reduce((acc, curr) => typeof curr === 'number' ? acc + curr : acc, 0);

        // 4. Fetch real pending counts using Doctor User ID from localStorage
        let livePendingRequests = 0;
        const doctorUserId = localStorage.getItem('userId');

        if (doctorUserId) {
          try {
            const pendingRes = await api.get(`/api/access-requests/doctor/pending-count/${doctorUserId}`);
            livePendingRequests = pendingRes.data.pendingCount || 0;
          } catch (e) {
            console.error("Could not fetch doctor pending requests count:", e);
          }
        }

        setLiveStats({
          todayPatients: totalPatientsCount,
          pendingRequests: livePendingRequests,
          averageFeedback: "4.9/5"
        });

      } catch (err) {
        console.error("Failed to fetch dashboard live metrics info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatsAndMetrics();
  }, []);

  // Generate the SVG Polyline path coordinates string dynamically based on backend points layout
  const generateSvgPath = () => {
    if (graphData.length === 0) return "";
    const totalPoints = graphData.length;
    // Calculate equal spacing across the width of the chart panel
    return graphData.map((d, index) => {
      const x = totalPoints > 1 ? (index / (totalPoints - 1)) * 100 : 50;
      return `${x},${d.yPosition}`;
    }).join(" ");
  };

  const statsCards = [
    { label: "Active Patients", value: liveStats.todayPatients, icon: UserCheck, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Requests", value: liveStats.pendingRequests, icon: Clock, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Total Feedback", value: liveStats.averageFeedback, icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50" },
  ];

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
        {statsCards.map((s) => (
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
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Patient Inflow Trend</h3>
            <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                <TrendingUp size={20} />
            </div>
          </div>

          <div className="h-48 relative w-full mb-6">
            {loading ? (
              <div className="w-full flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" /></div>
            ) : graphData.length > 0 ? (
              <div className="w-full h-full relative">
                {/* SVG Line Canvas Rendering */}
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={generateSvgPath()}
                    className="drop-shadow-[0_4px_6px_rgba(37,99,235,0.2)]"
                  />
                </svg>

                {/* Interactive Node Point Overlay Labels */}
                <div className="absolute inset-0 flex justify-between pointer-events-none">
                  {graphData.map((d, i) => {
                    const leftOffset = graphData.length > 1 ? (i / (graphData.length - 1)) * 100 : 50;
                    return (
                      <div
                        key={i}
                        className="absolute group/point pointer-events-auto cursor-pointer"
                        style={{ left: `${leftOffset}%`, top: `${d.yPosition}%`, transform: 'translate(-50%, -50%)' }}
                      >
                        <div className="w-3 h-3 bg-white border-2 border-blue-600 rounded-full shadow-md transition-transform group-hover/point:scale-150"></div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow opacity-0 group-hover/point:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {d.count} Appointments
                        </div>
                        <span className="absolute top-32 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-tighter whitespace-nowrap">
                          {d.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="w-full text-center text-slate-400 text-sm py-12">No data available for this week.</p>
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