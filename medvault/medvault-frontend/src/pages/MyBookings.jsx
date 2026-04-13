import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import {
  Clock, CheckCircle, XCircle, Calendar,
  User, RefreshCw, AlertCircle, CreditCard, Loader2, Star, X
} from 'lucide-react';

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Feedback States ---
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/appointments/patient/my-bookings');
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePayment = (booking) => {
    navigate('/patient/payment-gateway', {
      state: {
        appointmentId: booking.id,
        amount: booking.doctor.consultationFees,
        doctorName: booking.doctor.user.fullName
      }
    });
  };

  // --- Feedback Submission ---
  const submitFeedback = async () => {
    setSubmitting(true);
    try {
      await api.post('/api/feedbacks/submit', {
        appointmentId: selectedBooking.id,
        doctorId: selectedBooking.doctor.id,
        rating: rating,
        comment: comment
      });
      alert("Thank you for your feedback!");
      setShowRateModal(false);
      setComment("");
      setRating(5);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data || "Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'APPROVED': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'PAID': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'COMPLETED': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  if (loading && bookings.length === 0) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-page relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-slate-500 font-medium mt-1">Track your appointment requests and payment status.</p>
        </div>
        <button
          onClick={fetchBookings}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-sm space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
            <Calendar size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No bookings found</h3>
          <p className="text-slate-400 max-w-xs mx-auto text-sm">You haven't booked any appointments yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="flex items-start justify-between mb-6">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(booking.status)}`}>
                  {booking.status === 'APPROVED' ? 'PAYMENT PENDING' : booking.status}
                </div>
                <p className="text-xs font-bold text-slate-300">ID: #{booking.id}</p>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Dr. {booking.doctor.user.fullName}</h3>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">{booking.doctor.specialization}</p>
                </div>
              </div>

              {/* Payment Card */}
              {booking.status === 'APPROVED' && (
                <div className="mt-6 p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-200 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} />
                      <span className="font-bold text-sm">Action Required</span>
                    </div>
                    <span className="text-2xl font-black">₹{booking.doctor.consultationFees}</span>
                  </div>
                  <button
                    onClick={() => handlePayment(booking)}
                    className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard size={20} /> Pay Fees & Confirm
                  </button>
                </div>
              )}

              {/* NEW: Rate Consultation Button (Only for COMPLETED) */}
              {booking.status === 'COMPLETED' && !booking.feedbackSubmitted && (
                <button
                    onClick={() => {
                      console.log("Opening Modal for:", booking.id); // Add this to debug in F12 console
                      setSelectedBooking(booking);
                      setShowRateModal(true);
                    }}
                    className="mb-6 w-full py-4 bg-amber-50 text-amber-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-amber-100"
                  >
                    <Star size={18} /> Rate Your Experience
                  </button>
              )}

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                  <Calendar size={18} className="text-slate-300" />
                  <span>{booking.appointmentDate} at {booking.appointmentTime}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-500 italic leading-relaxed">
                  "{booking.reason}"
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {showRateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-page relative">
            <button onClick={() => setShowRateModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600">
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black text-slate-900">How was your visit?</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">Dr. {selectedBooking?.doctor?.user?.fullName}</p>

            {/* Star Selector */}
            <div className="flex justify-center gap-3 my-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`transition-all duration-300 hover:scale-110 ${rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                >
                  <Star size={40} fill={rating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Share your experience (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the doctor's behavior? Was the consultation helpful?"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 min-h-[120px] resize-none"
              />
            </div>

            <button
              onClick={submitFeedback}
              disabled={submitting}
              className="w-full mt-8 bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="animate-spin" /> : "Submit Review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}