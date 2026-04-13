import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import {
  Stethoscope, Calendar, Clock, ChevronRight,
  CheckCircle, User, DollarSign, ArrowLeft
} from 'lucide-react';

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    reason: "",
    date: "",
    time: "",
    doctorId: null,
    doctorName: ""
  });

  useEffect(() => {
    if (step === 2) {
      const fetchDoctors = async () => {
        try {
          const response = await api.get('/api/users/doctors');
          setDoctors(response.data);
        } catch (err) {
          console.error("Error fetching doctors", err);
        }
      };
      fetchDoctors();
    }
  }, [step]);

  const handleBooking = async () => {
    try {
      await api.post('/api/appointments/book', formData);
      setStep(4); // Success Step
    } catch (err) {
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-page">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-12 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <StepIndicator active={step >= 1} label="Problem" icon={Stethoscope} />
        <div className="h-px bg-slate-200 flex-1 mx-4"></div>
        <StepIndicator active={step >= 2} label="Choose Doctor" icon={User} />
        <div className="h-px bg-slate-200 flex-1 mx-4"></div>
        <StepIndicator active={step >= 3} label="Confirm" icon={CheckCircle} />
      </div>

      {/* Step 1: Describe Problem */}
      {step === 1 && (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <h2 className="text-2xl font-black text-slate-800">Tell us what's wrong</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Reason for Visit</label>
              <textarea
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-32 outline-none focus:ring-4 focus:ring-blue-500/10"
                placeholder="Describe your symptoms (e.g. Fever, persistent headache...)"
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Date</label>
              <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl"
                onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Preferred Time</label>
              <input type="time" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl"
                onChange={(e) => setFormData({...formData, time: e.target.value})} />
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
          >
            Find Specialists <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Step 2: Choose Doctor */}
      {step === 2 && (
        <div className="space-y-6">
          <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600">
            <ArrowLeft size={18} /> Back to details
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-500 transition-all cursor-pointer group"
                onClick={() => {
                  setFormData({...formData, doctorId: doc.id, doctorName: doc.fullName});
                  setStep(3);
                }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{doc.fullName}</h3>
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">{doc.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="flex items-center gap-1 text-slate-500 font-semibold text-sm">
                    <DollarSign size={14} /> Fees: ₹{doc.consultationFees}
                  </span>
                  <span className="text-blue-600 font-bold text-xs uppercase tracking-tighter">Select Doctor</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-800">Confirm Booking</h2>
          <div className="my-8 p-6 bg-slate-50 rounded-3xl text-left space-y-3">
            <p className="flex justify-between"><strong>Doctor:</strong> {formData.doctorName}</p>
            <p className="flex justify-between"><strong>Date:</strong> {formData.date}</p>
            <p className="flex justify-between"><strong>Time:</strong> {formData.time}</p>
            <p className="flex justify-between"><strong>Reason:</strong> {formData.reason}</p>
          </div>
          <button
            onClick={handleBooking}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Confirm & Send Request
          </button>
        </div>
      )}

      {/* Step 4: Final Success */}
      {step === 4 && (
        <div className="text-center py-20 space-y-6">
           <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-800">Request Sent!</h2>
          <p className="text-slate-500 max-w-sm mx-auto">Your booking request has been sent to {formData.doctorName}. You will be notified once they approve it.</p>
          <button onClick={() => window.location.href = '/patient/bookings'} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold">
            Go to My Bookings
          </button>
        </div>
      )}
    </div>
  );
}

function StepIndicator({ active, label, icon: Icon }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${active ? 'text-blue-600' : 'text-slate-300'}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${active ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-slate-50'}`}>
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}