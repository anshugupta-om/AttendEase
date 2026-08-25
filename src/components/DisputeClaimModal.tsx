import React, { useRef } from 'react';
import { AttendanceRecord, Timetable, UserProfile } from '../types';
import { ShieldAlert, Download, X, Copy, Check } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-bmw">
      <div className="bg-surface-soft rounded-lg max-w-2xl w-full border border-hairline-strong shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-canvas border border-hairline-strong text-text-link flex items-center justify-center font-bold rounded-md shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink">
                Dispute Application
              </h3>
              <p className="text-xs text-muted font-normal">
                Submit this claim document to your HOD or Attendance Cell
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyText}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-canvas border border-hairline-strong hover:bg-surface-soft hover:border-muted text-ink font-semibold text-xs rounded-md shadow-sm transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : null}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleDownloadClaimPdf}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-primary hover:bg-primary-active text-white border-0 font-semibold text-xs rounded-md shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-muted hover:text-ink cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Claim Paper Document */}
        <div
          ref={claimRef}
          className="bg-canvas p-6 border border-hairline-strong font-mono text-[11px] leading-relaxed text-ink space-y-4 whitespace-pre-wrap rounded-md shadow-inner"
        >
          {claimText}
        </div>
      </div>
    </div>
  );
};
