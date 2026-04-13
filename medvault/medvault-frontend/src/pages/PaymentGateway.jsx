import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';
import { ShieldCheck, CreditCard, Smartphone, Home, ChevronRight, Loader2, Lock } from 'lucide-react';

export default function PaymentGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointmentId, amount, doctorName } = location.state || {};
  const [step, setStep] = useState('methods'); // methods | processing | success

  useEffect(() => {
    if (!appointmentId) navigate('/patient/bookings');
  }, [appointmentId, navigate]);

  const handlePayment = async () => {
    setStep('processing');
    try {
      const response = await api.post(`/api/appointments/pay/${appointmentId}`);

      // If we reach here, it's a 200 OK
      setTimeout(() => {
        setStep('success');
        setTimeout(() => {
          navigate('/patient/bookings');
        }, 1500);
      }, 2000);
    } catch (err) {
      // FIX: Show the EXACT error from the Spring Boot Backend
      const serverMessage = err.response?.data || "Server Unreachable";
      alert("Payment Failed: " + serverMessage);
      setStep('methods');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-100 z-[100] flex items-center justify-center font-sans">
      <div className="bg-white w-full max-w-[700px] h-[500px] rounded shadow-2xl flex overflow-hidden border border-slate-200">

        {/* Razorpay Left Sidebar (The Brand Section) */}
        <div className="w-[260px] bg-[#1c2541] p-8 text-white flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2 opacity-80">
              <ShieldCheck size={20} className="text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Razorpay Trusted</span>
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Paying MedVault</p>
                <h2 className="text-lg font-bold">₹ {amount}.00</h2>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Doctor Assigned</p>
            <p className="text-sm font-medium">Dr. {doctorName}</p>
          </div>

          <div className="pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-slate-400 text-[9px] font-bold uppercase">
              <Lock size={12} /> Secure Checkout
            </div>
          </div>
        </div>

        {/* Razorpay Right Content (The Interaction Section) */}
        <div className="flex-1 p-0 flex flex-col relative bg-white">
          {step === 'methods' && (
            <>
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Payment Methods</h3>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">TEST MODE</span>
              </div>

              <div className="flex-1 overflow-y-auto">
                <PaymentMethod
                    icon={CreditCard} title="Cards" subtitle="Visa, MasterCard, RuPay"
                    onClick={handlePayment}
                  />
                  <PaymentMethod
                    icon={Smartphone} title="UPI" subtitle="Google Pay, PhonePe, Paytm"
                    onClick={handlePayment}
                    active
                  />
                  <PaymentMethod
                    icon={Home} title="Netbanking" subtitle="All Indian Banks"
                    onClick={handlePayment}
                  />
              </div>

              <div className="p-4 bg-slate-50 flex items-center justify-center gap-2">
                <img src="https://razorpay.com/assets/razorpay-glyph.svg" className="w-4 h-4" alt="rp" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Trusted by 50L+ businesses</span>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
              <p className="font-bold text-slate-600">Processing Payment...</p>
              <p className="text-xs text-slate-400">Do not refresh or press back</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-xl font-black text-slate-800">Payment Successful</h2>
              <p className="text-sm text-slate-400">Redirecting to MedVault...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentMethod({ icon: Icon, title, subtitle, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 ${active ? 'bg-blue-50/30' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-white rounded border border-slate-200 text-slate-400 shadow-sm">
          <Icon size={20} />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-slate-700">{title}</p>
          <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-slate-300" />
    </button>
  );
}