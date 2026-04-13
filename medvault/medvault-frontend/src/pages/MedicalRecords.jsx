import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { FileText, Download, Calendar, Activity } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Ensure this is imported

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await api.get('/api/prescriptions/patient/my-records');
        setRecords(response.data);
      } catch (err) {
        console.error("Error fetching medical records:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const downloadPDF = (record) => {
    const doc = new jsPDF();

    // 1. Header Branding
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("MEDVAULT DIGITAL HEALTHCARE", 105, 25, { align: "center" });

    // 2. Doctor & Patient Info (FETCHING AGE, SEX, REASON)
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Doctor: Dr. ${record.appointment.doctor?.user?.fullName}`, 20, 50);
    doc.text(`Patient: ${record.appointment.patient?.user?.fullName}`, 20, 56);

    doc.setFont("helvetica", "normal");
    // These are the fields you said were missing:
    doc.text(`Age/Sex: ${record.appointment.patient?.age || 'N/A'} / ${record.appointment.patient?.gender || 'N/A'}`, 20, 62);
    doc.text(`Reason for Visit: ${record.appointment.reason || 'General Consultation'}`, 20, 68);

    doc.text(`Date Issued: ${record.issuedDate}`, 150, 50);
    doc.text(`ID: #MV-${record.appointment.id}`, 150, 56);

    // 3. Rx Table (FIXED THE TYPEERROR HERE)
    // We split the string stored in DB back into 2 columns
    const medicinesArray = record.medicines.split(" | ").map(m => {
      const parts = m.split(": ");
      return [parts[0] || "N/A", parts[1] || "N/A"];
    });

    // CRITICAL FIX: Calling autoTable(doc, ...) instead of doc.autoTable()
    autoTable(doc, {
      startY: 75,
      head: [['Medicine Name', 'Dosage Instructions']],
      body: medicinesArray,
      theme: 'grid',
      headStyles: { fillColor: [30, 64, 175] },
      styles: { fontSize: 11, font: "helvetica" }
    });

    // 4. Notes
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFont("helvetica", "bold");
    doc.text("Doctor's Advice:", 20, finalY);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(record.doctorNotes || "No additional notes provided.", 170), 20, finalY + 7);

    // 5. Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("This is a digitally generated prescription by MedVault.", 105, 285, { align: "center" });

    doc.save(`MedVault_Prescription_${record.appointment.id}.pdf`);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Activity className="animate-spin text-blue-600" size={48} />
    </div>
  );

  return (
    <div className="p-8 lg:p-12 animate-page max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Medical Records</h1>
        <p className="text-slate-500 font-medium mt-2">Access your digital prescriptions and consultation history.</p>
      </div>

      {records.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {records.map((record) => (
            <div key={record.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                  <FileText size={28} />
                </div>
                <button
                  onClick={() => downloadPDF(record)}
                  className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/10"
                >
                  <Download size={20} />
                </button>
              </div>

              <h3 className="text-xl font-bold text-slate-900">Dr. {record.appointment.doctor?.user?.fullName}</h3>
              <p className="text-blue-600 font-bold text-sm uppercase tracking-wider">{record.appointment.doctor?.specialization}</p>

              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span className="text-xs font-bold">{record.issuedDate}</span>
                </div>
                <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase">Verified Record</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
          <FileText className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-500 font-bold">No medical records found yet.</p>
        </div>
      )}
    </div>
  );
}