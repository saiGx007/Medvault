import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Droplet, Phone, MapPin, Shield, Loader2, Activity, Edit3, Save, X } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  const { user } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/users/me');
      setProfile(response.data);
      setFormData(response.data); // Initialize form with current data
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.put('/api/users/update-profile', formData);
      await fetchProfile(); // Refresh data
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-page pb-20">
      {/* Header Section */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="w-32 h-32 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shrink-0">
          <User size={64} />
        </div>

        <div className="text-center md:text-left space-y-3 flex-1">
          {isEditing ? (
            <input
              name="fullName" value={formData.fullName} onChange={handleChange}
              className="text-3xl font-black text-slate-800 border-b-2 border-blue-500 outline-none w-full bg-slate-50 px-2"
            />
          ) : (
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{profile?.fullName}</h1>
          )}
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest">{profile?.role}</span>
            <span className="bg-emerald-50 text-emerald-700 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 italic">ID: #00{profile?.id}</span>
          </div>
        </div>

        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${isEditing ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
        >
          {isEditing ? <><Save size={18} /> Save Changes</> : <><Edit3 size={18} /> Edit Profile</>}
        </button>
        {isEditing && (
          <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500"><X size={24}/></button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 space-y-8">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <div className="w-2 h-6 bg-blue-600 rounded-full"></div> Personal Details
          </h3>
          <div className="space-y-6">
            <EditableInfo icon={Mail} label="Email Address" value={profile?.email} isEditing={false} />
            <EditableInfo icon={Calendar} name="dob" label="Date of Birth" value={formData.dob} isEditing={isEditing} onChange={handleChange} type="date" />
            <EditableInfo icon={User} name="gender" label="Gender" value={formData.gender} isEditing={isEditing} onChange={handleChange} isSelect options={['MALE', 'FEMALE', 'OTHER']} />
          </div>
        </div>

        {/* Health / Professional Info */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 space-y-8">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <div className="w-2 h-6 bg-rose-500 rounded-full"></div> {profile?.role === 'PATIENT' ? 'Health Metrics' : 'Work Details'}
          </h3>
          <div className="space-y-6">
            {profile?.role === 'PATIENT' ? (
              <>
                <EditableInfo icon={Droplet} name="bloodGroup" label="Blood Group" value={formData.bloodGroup} isEditing={isEditing} onChange={handleChange} />
                <EditableInfo icon={MapPin} name="occupation" label="Occupation" value={formData.occupation} isEditing={isEditing} onChange={handleChange} />
              </>
            ) : (
              <>
                <EditableInfo icon={Activity} name="specialization" label="Specialization" value={formData.specialization} isEditing={isEditing} onChange={handleChange} />
                <EditableInfo icon={Shield} name="designation" label="Designation" value={formData.designation} isEditing={isEditing} onChange={handleChange} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EditableInfo({ icon: Icon, label, value, name, isEditing, onChange, type = "text", isSelect = false, options = [] }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-transparent hover:border-slate-100 transition-all">
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 shrink-0">
        <Icon className="text-slate-400" size={20} />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        {isEditing ? (
          isSelect ? (
            <select name={name} value={value} onChange={onChange} className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-1 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500">
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <input
              type={type} name={name} value={value || ""} onChange={onChange}
              className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-1 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            />
          )
        ) : (
          <p className="text-slate-800 font-bold mt-0.5">{value || "Not Provided"}</p>
        )}
      </div>
    </div>
  );
}