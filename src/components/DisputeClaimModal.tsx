import React, { useRef } from 'react';
import { AttendanceRecord, Timetable, UserProfile } from '../types';
import { ShieldAlert, Download, Printer, X, Copy, Check } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DisputeClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  timetable: Timetable;
  records: AttendanceRecord[];
}

export const DisputeClaimModal: React.FC<DisputeClaimModalProps> = ({
  isOpen,
  onClose,
  user,
  timetable,
  records,
}) => {
  const claimRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  // Find missed or disputed lectures
  const absentRecords = records.filter(r => r.status === 'Absent').slice(0, 10);
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleDownloadClaimPdf = async () => {
    if (!claimRef.current) return;
    const canvas = await html2canvas(claimRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), (canvas.height * pdf.internal.pageSize.getWidth()) / canvas.width);
    pdf.save(`Attendance_Dispute_Claim_${user.name.replace(/\s+/g, '_')}.pdf`);
  };

  const claimText = `To,
The Head of Department / Attendance Committee,
Department of ${user.branch},
${user.collegeName || 'National Institute of Technology'}

Subject: Formal Application for Attendance Discrepancy Correction

Respected Sir/Madam,

I am ${user.name}, student of ${user.branch}, ${user.year}, Semester ${user.semester}, Section ${user.section}. I am writing to formally dispute and request a correction regarding an attendance discrepancy on the official portal.

According to my personal verified attendance log maintained on AttendEase, I was present for the following lectures marked absent on the college portal:

${absentRecords.map((r, i) => `${i + 1}. Date: ${r.date} | Subject: ${r.subjectName} (${r.subjectCode}) | Time Logged: ${new Date(r.timestamp).toLocaleTimeString()}`).join('\n')}

I request you to kindly inspect the physical attendance register or faculty log sheets for the specified dates and update my official records accordingly.

Thanking you,

Yours sincerely,
${user.name}
Branch: ${user.branch} | Sem: ${user.semester} | Sec: ${user.section}
Email: ${user.email}
Date: ${todayFormatted}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(claimText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Official Attendance Dispute Application
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Submit this claim document to your HOD or Attendance Cell
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyText}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleDownloadClaimPdf}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Claim Paper Document */}
        <div
          ref={claimRef}
          className="bg-slate-50 dark:bg-slate-950/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 space-y-4 whitespace-pre-wrap"
        >
          {claimText}
        </div>
      </div>
    </div>
  );
};
