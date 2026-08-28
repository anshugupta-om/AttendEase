import React, { useRef, useState } from 'react';
import { AttendanceRecord, Timetable, UserProfile } from '../types';
import { calculateAnalytics } from '../lib/analytics';
import { FileText, Download, X, CheckCircle, ShieldCheck } from 'lucide-react';
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

  const { subjectSummaries, stats } = calculateAnalytics(records, timetable, user.analyticsStartDate);
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
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-bmw">
      <div className="bg-surface-soft rounded-lg max-w-3xl w-full border border-hairline-strong shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-canvas border border-hairline-strong text-text-link flex items-center justify-center font-bold rounded-md shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink">
                Attendance PDF Report
              </h3>
              <p className="text-xs text-muted font-normal">
                Official document format for college office verification
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="flex items-center space-x-1.5 px-4 py-2 bg-primary hover:bg-primary-active text-white border-0 font-semibold text-xs rounded-md cursor-pointer shadow-md transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-muted hover:text-ink cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Canvas (White paper style for printing) */}
        <div
          ref={reportRef}
          className="bg-white text-slate-800 p-8 rounded-lg border border-slate-200 space-y-6 text-sm shadow-sm"
        >
          {/* Document Header */}
          <div className="flex items-start justify-between pb-6 border-b border-slate-200">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="flex h-3 w-8 space-x-0.5 overflow-hidden rounded-full">
                  <div className="w-1/2 bg-[#0d74ce]" />
                  <div className="w-1/2 bg-[#a8c8e8]" />
                </div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  AttendEase Academic Report
                </h1>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5px]">
                {user.collegeName || 'National Institute of Technology'}
              </p>
            </div>

            <div className="text-right text-[10px] text-slate-500 font-mono">
              <span className="font-bold text-slate-900 block uppercase">Report ID: AE-{Date.now().toString().slice(-6)}</span>
              <span>Generated: {todayFormatted}</span>
            </div>
          </div>

          {/* Student & Class Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-md bg-slate-50 border border-slate-200/60 text-xs">
            <div>
              <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-[0.5px]">Student Name</span>
              <span className="font-bold text-slate-900 text-sm">{user.name.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-[0.5px]">Branch & Year</span>
              <span className="font-bold text-slate-800">{user.branch} • {user.year.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-[0.5px]">Semester & Sec</span>
              <span className="font-bold text-slate-800">SEM {user.semester} • SEC {user.section}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-[0.5px]">Classroom</span>
              <span className="font-bold text-slate-800">{timetable.roomNumber}</span>
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-5 rounded-md bg-slate-50 border border-slate-200/60 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5px] block font-mono">
                Overall Attendance Percentage
              </span>
              <span className="text-3xl font-bold text-slate-900 font-mono">
                {stats.overallPercentage}%
              </span>
              <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                Total Classes: {stats.totalLectures} • Attended: {stats.totalAttended} • Missed: {stats.totalMissed}
                {user.analyticsStartDate && ` • Filtered from: ${new Date(user.analyticsStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
              </p>
            </div>

            <div className="text-right">
              <span
                className={`px-3 py-1 border text-[10px] font-bold uppercase tracking-[0.5px] inline-flex items-center space-x-1.5 rounded-full ${
                  stats.overallPercentage >= 75
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{stats.overallPercentage >= 75 ? 'ELIGIBLE (>=75%)' : 'DEFICITER (<75%)'}</span>
              </span>
            </div>
          </div>

          {/* Subject Wise Table */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.5px] text-slate-400 font-mono">
              Subject Wise Breakdown
            </h4>
            <div className="overflow-x-auto border border-slate-200/80 rounded-md shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 font-bold text-slate-600 border-b border-slate-200 uppercase tracking-[0.5px]">
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
                <tbody className="divide-y divide-slate-100 font-medium">
                  {subjectSummaries.map((sub) => (
                    <tr key={sub.subjectCode} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-mono font-bold text-slate-700">{sub.subjectCode}</td>
                      <td className="p-2.5 font-bold text-slate-800 uppercase">{sub.subjectName}</td>
                      <td className="p-2.5 text-slate-600">{sub.facultyName}</td>
                      <td className="p-2.5 text-center text-slate-700 font-mono">{sub.totalLectures}</td>
                      <td className="p-2.5 text-center text-green-600 font-bold font-mono">{sub.totalLectures === 0 ? '—' : sub.attended}</td>
                      <td className="p-2.5 text-center text-red-500 font-bold font-mono">{sub.totalLectures === 0 ? '—' : sub.missed}</td>
                      <td className="p-2.5 text-right font-bold font-mono">
                        <span
                          className={
                            sub.totalLectures === 0
                              ? 'text-slate-400 font-normal'
                              : sub.percentage >= 75
                              ? 'text-green-600'
                              : sub.percentage >= 60
                              ? 'text-amber-600'
                              : 'text-red-500'
                          }
                        >
                          {sub.totalLectures === 0 ? 'N/A' : `${sub.percentage}%`}
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
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span className="uppercase tracking-[0.5px]">Verified Logs • AttendEase Engine</span>
            </div>
            <div className="text-right">
              <div className="h-8 border-b border-slate-300 w-32 mb-1" />
              <span className="uppercase tracking-[0.5px]">Student / HOD Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
