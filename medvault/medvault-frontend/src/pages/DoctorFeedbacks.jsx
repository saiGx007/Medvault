import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Star, MessageSquare, User, Calendar, Loader2, Award } from 'lucide-react';

export default function DoctorFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use an empty dependency array [] to prevent the infinite loop error
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await api.get('/api/feedbacks/doctor/my-reviews');
        setFeedbacks(response.data);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-page">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Award className="text-blue-600" size={32} /> Patient Reviews
        </h1>
        <p className="text-slate-500 font-medium mt-1"> feedback from your completed consultations.</p>
      </div>

      {feedbacks.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-sm">
          <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-xl font-bold text-slate-800">No reviews yet</h3>
          <p className="text-slate-400">Feedback will appear here once patients rate your completed sessions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{fb.patient.user.fullName}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={fb.rating >= s ? "text-amber-400 fill-amber-400" : "text-slate-200"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl h-fit">
                  <Calendar size={12} /> {new Date(fb.createdAt).toLocaleDateString()}
                </div>
              </div>

              {fb.comment && (
                <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-600 text-sm leading-relaxed">
                  "{fb.comment}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}