import React, { useState, useEffect } from 'react';
import { Timetable, UserProfile } from '../types';
import { sanitizeTimetable } from '../lib/storage';
import { SAMPLE_TIMETABLES } from '../data/sampleTimetables';
import { Upload, Sparkles, Check, AlertCircle, X, Loader2, Users, ShieldAlert } from 'lucide-react';

interface TimetableUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTimetableParsed: (timetable: Timetable) => void;
  user?: UserProfile | null;
}

type ModalView = 'checking' | 'template-found' | 'upload' | 'preview';

export const TimetableUploadModal: React.FC<TimetableUploadModalProps> = ({
  isOpen,
  onClose,
  onTimetableParsed,
  user,
}) => {
  const [view, setView] = useState<ModalView>('checking');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<Timetable | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sharedTemplate, setSharedTemplate] = useState<any>(null);

  // On open, check if a shared template exists for this user's class
  useEffect(() => {
    if (!isOpen) return;
    // Reset state on each open
    setFile(null);
    setErrorMsg(null);
    setParsedPreview(null);
    setSharedTemplate(null);

    if (user?.branch && user?.year && user?.semester && user?.section) {
      setView('checking');
      fetch(`/api/timetable-template?branch=${encodeURIComponent(user.branch)}&year=${encodeURIComponent(user.year)}&semester=${encodeURIComponent(user.semester)}&section=${encodeURIComponent(user.section)}`)
        .then(r => r.json())
        .then(data => {
          if (data.success && data.found && data.template?.weeklySchedule) {
            setSharedTemplate(data.template);
            setView('template-found');
          } else {
            setView('upload');
          }
        })
        .catch(() => setView('upload'));
    } else {
      setView('upload');
    }
  }, [isOpen, user?.branch, user?.year, user?.semester, user?.section]);

  if (!isOpen) return null;

  const handleUseSharedTemplate = async () => {
    if (!sharedTemplate) return;
    // Increment usage counter in background
    fetch('/api/increment-template-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branch: user?.branch,
        year: user?.year,
        semester: user?.semester,
        section: user?.section
      })
    }).catch(() => {/* silent */});

    const timetable = sanitizeTimetable({
      id: `tt_shared_${Date.now()}`,
      branch: sharedTemplate.branch,
      year: sharedTemplate.year,
      semester: sharedTemplate.semester,
      section: sharedTemplate.section,
      roomNumber: sharedTemplate.roomNumber,
      updatedAt: sharedTemplate.updatedAt || new Date().toISOString(),
      weeklySchedule: sharedTemplate.weeklySchedule,
      isSharedTemplate: true,
      sourceType: 'shared'
    });

    onTimetableParsed(timetable);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg(null);
    }
  };

  const handleParsePdf = async () => {
    if (!file) {
      setErrorMsg('Please select a valid timetable PDF or image file.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setUploadStatusText('Reading document layout & OCR text...');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64Data = reader.result as string;

        setUploadStatusText('Analyzing structure with Gemini AI...');

        const response = await fetch('/api/parse-timetable', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileData: base64Data,
            fileName: file.name,
            mimeType: file.type || 'application/pdf',
            userBranch: user?.branch,
            userYear: user?.year,
            userSemester: user?.semester,
            userSection: user?.section
          })
        });

        const data = await response.json();

        if (data.success && data.timetable) {
          setParsedPreview(data.timetable);
          setView('preview');
          setIsUploading(false);
        } else {
          throw new Error('Failed to parse timetable structure.');
        }
      };

      reader.onerror = () => {
        throw new Error('File reading failed.');
      };

    } catch (err: any) {
      console.error(err);
      setIsUploading(false);
      setErrorMsg('Could not parse timetable file. Using official sample format.');
      setParsedPreview(SAMPLE_TIMETABLES['AIML-3-A']);
      setView('preview');
    }
  };

  const handleApplySample = (sampleKey: string) => {
    const selected = SAMPLE_TIMETABLES[sampleKey];
    if (selected) {
      onTimetableParsed(selected);
      onClose();
    }
  };

  const handleConfirmTimetable = () => {
    if (parsedPreview) {
      onTimetableParsed(parsedPreview);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-bmw">
      <div className="bg-surface-soft rounded-lg max-w-xl w-full border border-hairline-strong shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-canvas border border-hairline-strong text-text-link flex items-center justify-center font-bold rounded-md shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink">
                {view === 'template-found' ? 'Shared Timetable Found' : 'Upload Class Timetable PDF'}
              </h3>
              <p className="text-xs text-muted font-normal">
                {view === 'template-found' ? 'Your class already has a parsed timetable' : 'Automatic OCR & AI layout structural parser'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted hover:text-ink cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checking State */}
        {view === 'checking' && (
          <div className="py-10 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-text-link animate-spin mx-auto" />
            <p className="text-xs font-semibold text-ink tracking-[0.5px]">
              Checking shared templates for your class...
            </p>
          </div>
        )}

        {/* Shared Template Found */}
        {view === 'template-found' && sharedTemplate && (
          <div className="space-y-5">
            {/* Template Details */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 rounded-md space-y-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 tracking-[0.5px]">
                  SHARED CLASS TEMPLATE
                </span>
              </div>
              <p className="text-sm font-semibold text-ink">
                {sharedTemplate.branch} &bull; {sharedTemplate.year} &bull; Semester {sharedTemplate.semester} &bull; Section {sharedTemplate.section}
              </p>
              <div className="flex items-center space-x-4 text-[10px] text-muted font-mono">
                <span>Used by {sharedTemplate.usageCount || 0} student(s)</span>
                <span>Updated: {sharedTemplate.updatedAt ? new Date(sharedTemplate.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}</span>
              </div>
            </div>

            {/* Flagged Warning */}
            {sharedTemplate.reports > 0 && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-300/50 rounded-md flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
                <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 tracking-[0.5px]">
                  Flagged as potentially incorrect by {sharedTemplate.reports} student(s). Review carefully.
                </p>
              </div>
            )}

            {/* Monday Preview */}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              <span className="text-[10px] font-bold text-ink tracking-[0.5px] block font-mono">
                Monday Preview ({sharedTemplate.weeklySchedule?.Monday?.length || 0} slots):
              </span>
              {(sharedTemplate.weeklySchedule?.Monday || []).map((slot: any, i: number) => (
                <div
                  key={i}
                  className="p-3 bg-canvas border border-hairline-strong text-xs flex items-center justify-between rounded-md shadow-sm"
                >
                  <div>
                    <span className="font-bold text-ink">{slot.subjectCode}: {slot.subjectName}</span>
                    <span className="block text-[10px] text-muted font-normal mt-0.5 font-mono">
                      {slot.startTime} - {slot.endTime} &bull; {slot.facultyName}
                    </span>
                  </div>
                  {slot.isLab && (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold bg-surface-strong text-ink border border-hairline-strong rounded-full">LAB</span>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setView('upload')}
                className="flex-1 py-3 border border-hairline-strong text-ink font-semibold text-xs rounded-md hover:bg-surface-soft hover:border-muted transition-colors cursor-pointer bg-canvas shadow-sm"
              >
                Upload My Own Instead
              </button>
              <button
                onClick={handleUseSharedTemplate}
                className="flex-1 py-3 bg-primary hover:bg-primary-active text-white border-0 font-semibold text-xs rounded-md transition-colors cursor-pointer shadow-md flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Use This Template</span>
              </button>
            </div>
          </div>
        )}

        {/* Upload Dropzone */}
        {view === 'upload' && (
          <div className="space-y-4">
            {sharedTemplate && (
              <button
                onClick={() => setView('template-found')}
                className="text-xs font-semibold text-text-link hover:text-text-link-secondary border-b border-text-link hover:border-text-link-secondary cursor-pointer pb-0.5 transition-colors"
              >
                ← Back to shared template
              </button>
            )}

            <div className="border-2 border-dashed border-hairline-strong hover:border-muted rounded-lg p-8 text-center bg-canvas transition-colors cursor-pointer relative shadow-inner">
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-12 h-12 bg-canvas border border-hairline-strong text-text-link flex items-center justify-center mx-auto mb-3 rounded-md shadow-sm">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-ink">
                {file ? file.name : 'Choose or drop your Timetable PDF / Image'}
              </h4>
              <p className="text-xs text-muted max-w-xs mx-auto mt-1.5 font-normal leading-relaxed">
                Supports official college timetable PDFs with lecture timings, rooms, faculty, and lab batches.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-md border border-red-200/50 tracking-[0.5px] flex items-center space-x-2 shadow-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isUploading ? (
              <div className="py-6 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-text-link animate-spin mx-auto" />
                <p className="text-xs font-semibold text-ink tracking-[0.5px]">{uploadStatusText}</p>
              </div>
            ) : (
              <button
                onClick={handleParsePdf}
                disabled={!file}
                className="w-full py-3.5 bg-primary hover:bg-primary-active text-white disabled:opacity-50 font-semibold text-xs tracking-[0.5px] rounded-md transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md border-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Extract Timetable with Gemini AI</span>
              </button>
            )}

            {/* Quick Sample Timetable Buttons */}
            <div className="pt-4 border-t border-hairline space-y-2">
              <span className="text-[10px] font-bold text-muted uppercase tracking-[0.5px] block font-mono">
                Or Use Official Pre-Built Templates
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleApplySample('AIML-3-A')}
                  className="p-4 border border-hairline-strong hover:border-muted bg-canvas text-left text-xs space-y-1.5 rounded-md cursor-pointer shadow-sm"
                >
                  <span className="font-bold text-ink tracking-tight block">AIML - Sem 3 (Sec A)</span>
                  <span className="text-[10px] text-muted font-normal block font-mono">AI, DSA, DBMS, Maths, Labs</span>
                </button>
                <button
                  onClick={() => handleApplySample('DS-3-A')}
                  className="p-4 border border-hairline-strong hover:border-muted bg-canvas text-left text-xs space-y-1.5 rounded-md cursor-pointer shadow-sm"
                >
                  <span className="font-bold text-ink tracking-tight block">Data Science - Sem 3 (Sec A)</span>
                  <span className="text-[10px] text-muted font-normal block font-mono">Data Viz, Stats, DBMS, Labs</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Parsed Preview Confirmation */}
        {view === 'preview' && parsedPreview && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-xs rounded-md border border-green-200/50 flex items-center space-x-2 shadow-sm">
              <Check className="w-5 h-5 shrink-0 text-green-600 dark:text-green-400" />
              <div className="tracking-[0.5px] space-y-0.5">
                <strong className="font-semibold">Successfully extracted timetable!</strong>
                <p className="text-[10px] font-normal opacity-90 font-mono">
                  {parsedPreview.branch} &bull; Year {parsedPreview.year} &bull; Semester {parsedPreview.semester} &bull; Section {parsedPreview.section}
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <span className="text-[10px] font-bold text-ink tracking-[0.5px] block font-mono">
                Monday Preview ({parsedPreview.weeklySchedule.Monday?.length || 0} slots):
              </span>
              {parsedPreview.weeklySchedule.Monday?.map((slot, i) => (
                <div
                  key={i}
                  className="p-3 bg-canvas border border-hairline-strong text-xs flex items-center justify-between rounded-md shadow-sm"
                >
                  <div>
                    <span className="font-bold text-ink">{slot.subjectCode}: {slot.subjectName}</span>
                    <span className="block text-[10px] text-muted font-normal mt-0.5 font-mono">
                      {slot.startTime} - {slot.endTime} &bull; {slot.facultyName} &bull; {slot.roomNumber}
                    </span>
                  </div>
                  {slot.isLab && (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold bg-surface-strong text-ink border border-hairline-strong rounded-full">LAB</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setView('upload')}
                className="flex-1 py-3 border border-hairline-strong text-ink font-semibold text-xs rounded-md hover:bg-surface-soft hover:border-muted transition-colors cursor-pointer bg-canvas shadow-sm"
              >
                Back
              </button>
              <button
                onClick={handleConfirmTimetable}
                className="flex-1 py-3 bg-primary hover:bg-primary-active text-white border-0 font-semibold text-xs rounded-md transition-colors cursor-pointer shadow-md"
              >
                Confirm & Load
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
