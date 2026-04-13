import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Plus, Trash2, Send, ChevronLeft, Pill, User, Activity, Loader2, Calendar } from 'lucide-react';

export default function PrescriptionPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [medicines, setMedicines] = useState([{ type: '', dosage: '' }]);
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(`/api/appointments/${appointmentId}`);
        setAppointment(response.data);
      } catch (err) {
        console.error(err);
        if(err.response?.status === 401) navigate('/login');
      } finally { setLoading(false); }
    };
    fetchDetails();
  }, [appointmentId, navigate]);

  const addMedicine = () => {
    if (medicines.length < 10) setMedicines([...medicines, { type: '', dosage: '' }]);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Combine medicines into a structured string for the DB
    const medString = medicines.map(m => `${m.type}: ${m.dosage}`).join(" | ");

    try {
      // 1. Submit the prescription
      // 2. The Backend MUST update appointment status to 'COMPLETED'
      await api.post('/api/prescriptions/submit', {
        appointmentId,
        medicines: medString,
        notes: advice
      });

      alert("Prescription sent to patient successfully!");
      navigate('/doctor/consultations'); // Redirect doctor back to their queue
    } catch (err) {
      alert("Failed to send prescription. Please try again.");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12 animate-page">
      <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ChevronLeft size={20} /> Cancel
            </button>
            <h2 className="text-xl font-black uppercase tracking-widest">Generate Prescription</h2>
        </div>

        <form onSubmit={handleFinalSubmit} className="p-10 space-y-10">
          {/* Patient Info Header - DISPLAYING ALL REQUESTED FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Details</p>
              <h3 className="text-2xl font-black text-slate-900">{appointment.patient?.user?.fullName}</h3>
              <div className="flex gap-4 text-sm font-bold text-slate-600">
                <span>Age: {appointment.patient?.age || 'N/A'}</span>
                <span>Sex: {appointment.patient?.gender || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-rose-600 text-sm font-bold bg-rose-50 px-3 py-1 rounded-lg w-fit">
                <Activity size={14} /> Reason: {appointment.reason}
              </div>
            </div>
            <div className="md:text-right flex flex-col justify-center space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor / Date</p>
              <p className="text-lg font-bold text-slate-800">Dr. {appointment.doctor?.user?.fullName}</p>
              <div className="flex items-center md:justify-end gap-2 text-slate-500 font-medium">
                <Calendar size={14} /> {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Rx Inputs */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
               <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><Pill className="text-blue-600"/> Medications (Max 10)</h3>
               <button type="button" onClick={addMedicine} className="text-blue-600 font-bold text-xs bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all">
                 + Add Row
               </button>
            </div>

            <div className="space-y-4">
              {medicines.map((m, i) => (
                <div key={i} className="flex gap-4 items-center animate-in slide-in-from-top-2">
                   <input
                      placeholder="Medicine Type/Name"
                      value={m.type}
                      onChange={(e) => {
                        const list = [...medicines];
                        list[i].type = e.target.value;
                        setMedicines(list);
                      }}
                      className="flex-[2] bg-slate-50 border-none p-4 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                   />
                   <input
                      placeholder="Dosage Instructions"
                      value={m.dosage}
                      onChange={(e) => {
                        const list = [...medicines];
                        list[i].dosage = e.target.value;
                        setMedicines(list);
                      }}
                      className="flex-1 bg-slate-50 border-none p-4 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                   />
                   {medicines.length > 1 && (
                     <button type="button" onClick={() => setMedicines(medicines.filter((_, idx) => idx !== i))} className="text-rose-400 hover:text-rose-600 p-2">
                       <Trash2 size={20}/>
                     </button>
                   )}
                </div>
              ))}
            </div>
          </div>

          {/* Advice */}
          <div className="space-y-3">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Additional Advice</p>
             <textarea
               value={advice}
               onChange={(e) => setAdvice(e.target.value)}
               className="w-full bg-slate-50 border-none p-6 rounded-[2rem] font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
               placeholder="Enter lifestyle changes or notes..."
               rows="3"
             />
          </div>

          <button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50">
             {saving ? "Sending Data..." : "Send Prescription to Patient"}
          </button>
        </form>
      </div>
    </div>
  );
}