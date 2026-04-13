import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { Activity } from "lucide-react";

export default function Register() {
  const [role, setRole] = useState("PATIENT");
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", gender: "",
    dob: "", bloodGroup: "", occupation: "",
    designation: "", specialization: "", consultationFees: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Basic Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.gender) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    // 2. CREATE CLEAN PAYLOAD (Crucial for fixing 400 error)
    // We only send fields that are NOT empty strings to avoid Java mapping errors
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: role, // Use the state variable
      gender: formData.gender
    };

    if (role === "PATIENT") {
      if (formData.dob) payload.dob = formData.dob;
      if (formData.bloodGroup) payload.bloodGroup = formData.bloodGroup;
    } else {
      if (formData.specialization) payload.specialization = formData.specialization;
      if (formData.designation) payload.designation = formData.designation;
      if (formData.occupation) payload.occupation = formData.occupation;
      // Convert string to Number for the Java Double field
      if (formData.consultationFees) payload.consultationFees = Number(formData.consultationFees);
    }

    try {
      const response = await api.post("/api/auth/register", payload);
      if (response.status === 200 || response.status === 201) {
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration Error:", err);
      // Unwrap the error message so it's not [object Object]
      const msg = err.response?.data?.message || err.response?.data || "Registration failed.";
      alert(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-page min-h-screen flex bg-white overflow-hidden font-sans">
      {/* Branding Sidebar */}
      <div className={`hidden md:flex flex-col justify-center items-center bg-slate-900 text-white p-12 transition-all duration-700 ${role === "DOCTOR" ? "w-[25%]" : "w-[35%]"}`}>
        <div className="text-center">
          <Activity className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
          <h1 className="text-3xl font-bold tracking-tight">MedVault</h1>
          <p className="text-slate-400 text-sm mt-2 opacity-80">Secure Medical Management</p>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-slate-50/50 overflow-y-auto">
        <div className="w-full max-w-3xl bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
            <p className="text-slate-500 mt-2 font-medium">Please enter your details to register.</p>
          </div>

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Registering as</label>
              <select
                name="role"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-2">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {role === "PATIENT" ? (
              <>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-2">Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-2">Blood Group</label>
                  <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="O+" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-2">Specialization</label>
                  <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Cardiology" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-2">Consultation Fees</label>
                  <input type="number" name="consultationFees" value={formData.consultationFees} onChange={handleChange} placeholder="500" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
              </>
            )}

            <div className="md:col-span-2 flex flex-col items-center pt-6">
              <button type="submit" disabled={loading} className="w-full md:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50">
                {loading ? "Registering..." : "Register Now"}
              </button>
              <p className="mt-4 text-slate-500 text-sm font-medium">
                Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}