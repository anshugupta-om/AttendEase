import React, { useState, useEffect } from 'react';
import { LectureSlot, LectureOverride } from '../types';
import { X, Save, RotateCcw, Plus } from 'lucide-react';

interface LectureEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot?: LectureSlot;
  existingOverride?: LectureOverride | null;
  mode?: 'edit' | 'add';
  defaultDayOfWeek?: string;
  onSave: (override: any, dayOfWeek?: string) => void;
  onRevert?: () => void;
}

export const LectureEditModal: React.FC<LectureEditModalProps> = ({
  isOpen,
  onClose,
  slot,
  existingOverride,
  mode = 'edit',
  defaultDayOfWeek = 'Monday',
  onSave,
  onRevert,
}) => {
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [isLab, setIsLab] = useState(false);
  const [batchSection, setBatchSection] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(defaultDayOfWeek);

  // Pre-fill fields from override (if exists) or from slot
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && slot) {
        setSubjectName(existingOverride?.subjectName ?? slot.subjectName);
        setSubjectCode(existingOverride?.subjectCode ?? slot.subjectCode);
        setFacultyName(existingOverride?.facultyName ?? slot.facultyName);
        setStartTime(existingOverride?.startTime ?? slot.startTime);
        setEndTime(existingOverride?.endTime ?? slot.endTime);
        setRoomNumber(existingOverride?.roomNumber ?? slot.roomNumber);
        setIsLab(existingOverride?.isLab ?? slot.isLab ?? false);
        setBatchSection(existingOverride?.batchSection ?? slot.batchSection ?? '');
      } else if (mode === 'add') {
        setSubjectName('');
        setSubjectCode('');
        setFacultyName('');
        setStartTime('');
        setEndTime('');
        setRoomNumber('');
        setIsLab(false);
        setBatchSection('');
        setDayOfWeek(defaultDayOfWeek);
      }
    }
  }, [isOpen, slot, existingOverride, mode, defaultDayOfWeek]);

  if (!isOpen) return null;

  const handleSave = () => {
    const override: LectureOverride = {
      subjectName,
      subjectCode,
      facultyName,
      startTime,
      endTime,
      roomNumber,
      isLab,
      batchSection,
      editedAt: new Date().toISOString(),
    };
    onSave(override, mode === 'add' ? dayOfWeek : undefined);
  };

  const handleRevert = () => {
    if (onRevert) onRevert();
    onClose();
  };

  const inputClasses = 'w-full px-3 py-2.5 bg-canvas border border-hairline-strong rounded-md text-xs text-ink focus:outline-none focus:border-text-link tracking-[0.5px]';
  const labelClasses = 'block text-[10px] font-bold tracking-[1px] uppercase text-muted mb-1 font-mono';

  const daysOfWeekList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-bmw">
      <div className="bg-surface-card rounded-lg max-w-md w-full border border-hairline-strong shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-hairline">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-ink tracking-tight">{mode === 'add' ? 'Add Personal Lecture' : 'Edit Lecture'}</h3>
            <p className="text-[10px] text-muted font-mono">
              {mode === 'add' ? 'Personal elective or extra class' : `L${slot?.lectureNumber} • ${slot?.dayOfWeek} • Personal override only`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-muted hover:text-ink cursor-pointer rounded-md hover:bg-surface-soft transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 rounded-md">
          <p className="text-[11px] text-blue-700 dark:text-blue-300 font-semibold leading-relaxed">
            {mode === 'add' 
              ? 'This lecture is added only to your personal schedule and does not affect the shared template.'
              : 'This edit changes only what you see. Other students in your section will continue to see the shared template.'}
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {mode === 'add' && (
            <div>
              <label className={labelClasses}>Day of Week</label>
              <select 
                value={dayOfWeek} 
                onChange={(e) => setDayOfWeek(e.target.value)} 
                className={inputClasses}
              >
                {daysOfWeekList.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className={labelClasses}>Subject Name</label>
            <input type="text" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className={inputClasses} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClasses}>Subject Code</label>
              <input type="text" value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Room Number</label>
              <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} className={inputClasses} />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Faculty Name</label>
            <input type="text" value={facultyName} onChange={(e) => setFacultyName(e.target.value)} className={inputClasses} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClasses}>Start Time</label>
              <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="09:00 AM" className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>End Time</label>
              <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="10:00 AM" className={inputClasses} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <label className={labelClasses}>Lab Session</label>
              <div
                onClick={() => setIsLab(!isLab)}
                className="flex items-center space-x-3 px-3 py-2.5 bg-canvas border border-hairline-strong rounded-md cursor-pointer hover:border-muted transition-all"
              >
                <div className={`w-8 h-4.5 p-0.5 rounded-full flex items-center transition-all ${isLab ? 'bg-primary' : 'bg-canvas-soft border border-hairline-strong'}`}>
                  <div className={`w-3.5 h-3.5 bg-white rounded-full transition-transform shadow-sm ${isLab ? 'translate-x-3.5' : 'translate-x-0'}`} />
                </div>
                <span className="text-xs font-semibold text-ink">{isLab ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div>
              <label className={labelClasses}>Batch / Section Tag</label>
              <input type="text" value={batchSection} onChange={(e) => setBatchSection(e.target.value)} placeholder="All, C1, C2" className={inputClasses} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-3 border-t border-hairline">
          {existingOverride && mode === 'edit' && (
            <button
              onClick={handleRevert}
              className="flex-1 py-3 border border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 font-semibold text-xs rounded-md hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors cursor-pointer flex items-center justify-center space-x-2 bg-canvas shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revert to Shared</span>
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-primary hover:bg-primary-active text-white border-0 font-semibold text-xs rounded-md transition-colors cursor-pointer shadow-md flex items-center justify-center space-x-2"
          >
            {mode === 'add' ? <Plus className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{mode === 'add' ? 'Add Lecture' : 'Save Edit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
