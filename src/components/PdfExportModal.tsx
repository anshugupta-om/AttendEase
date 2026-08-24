import React, { useRef, useState } from 'react';
import { AttendanceRecord, Timetable, UserProfile } from '../types';
import { calculateAnalytics } from '../lib/analytics';
import { FileText, Download, Printer, X, CheckCircle2, ShieldCheck, Calendar, Award } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  timetable: Timetable;
  records: AttendanceRecord[];
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  user,
  timetable,
  records,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const { subjectSummaries, stats } = calculateAnalytics(records, timetable);
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AttendEase_Report_${user.name.replace(/\s+/g, '_')}_${user.branch}.pdf`);
    } catch (err) {
      console.error('Failed generating PDF:', err);
      // Fallback print
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Official Attendance PDF Report
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generated for college verification & claim submission
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Canvas */}
        <div
          ref={reportRef}
          className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-200 space-y-6 text-sm"
        >
          {/* Document Header */}
          <div className="flex items-start justify-between pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
                  AE
                </div>
                <h1 className="text-xl font-black text-indigo-950 tracking-tight">
                  AttendEase Academic Report
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {user.collegeName || 'National Institute of Technology'}
              </p>
            </div>

            <div className="text-right text-xs text-slate-500 font-mono">
              <span className="font-bold text-slate-700 block">Report ID: AE-{Date.now().toString().slice(-6)}</span>
              <span>Generated: {todayFormatted}</span>
            </div>
          </div>

          {/* Student & Class Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Student Name</span>
              <span className="font-bold text-slate-900 text-sm">{user.name}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Branch & Year</span>
              <span className="font-bold text-slate-900">{user.branch} • {user.year}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Semester & Sec</span>
              <span className="font-bold text-slate-900">Sem {user.semester} • Sec {user.section}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Classroom</span>
              <span className="font-bold text-slate-900">{timetable.roomNumber}</span>
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block">
                Overall Attendance Percentage
              </span>
              <span className="text-3xl font-black text-indigo-950">
                {stats.overallPercentage}%
              </span>
              <p className="text-xs text-indigo-700 mt-0.5">
                Total Classes: {stats.totalLectures} • Attended: {stats.totalAttended} • Missed: {stats.totalMissed}
              </p>
            </div>

            <div className="text-right">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center space-x-1 ${
                  stats.overallPercentage >= 75
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{stats.overallPercentage >= 75 ? 'EXAM ELIGIBLE (>=75%)' : 'DEFICITER (<75%)'}</span>
              </span>
            </div>
          </div>

          {/* Subject Wise Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Subject Wise Breakdown
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Code</th>
                    <th className="p-2.5">Subject Name</th>
                    <th className="p-2.5">Faculty</th>
                    <th className="p-2.5 text-center">Total</th>
                    <th className="p-2.5 text-center">Attended</th>
                    <th className="p-2.5 text-center">Missed</th>
                    <th className="p-2.5 text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {subjectSummaries.map((sub) => (
                    <tr key={sub.subjectCode} className="hover:bg-slate-50 font-medium">
                      <td className="p-2.5 font-mono font-bold text-indigo-900">{sub.subjectCode}</td>
                      <td className="p-2.5 font-semibold text-slate-900">{sub.subjectName}</td>
                      <td className="p-2.5 text-slate-600">{sub.facultyName}</td>
                      <td className="p-2.5 text-center">{sub.totalLectures}</td>
                      <td className="p-2.5 text-center text-emerald-700 font-bold">{sub.attended}</td>
                      <td className="p-2.5 text-center text-rose-600 font-bold">{sub.missed}</td>
                      <td className="p-2.5 text-right font-black">
                        <span
                          className={
                            sub.percentage >= 75
                              ? 'text-emerald-700'
                              : sub.percentage >= 60
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }
                        >
                          {sub.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Student Attendance Log • AttendEase Engine</span>
            </div>
            <div className="text-right">
              <div className="h-8 border-b border-slate-300 w-32 mb-1" />
              <span>Student / HOD Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
