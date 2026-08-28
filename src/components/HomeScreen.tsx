import React, { useState } from 'react';
import { AttendanceRecord, AttendanceStatus, LectureSlot, LectureOverride, Timetable, UserProfile, UserTimetableOverrides } from '../types';
import { Check, X, Clock, MapPin, User, Sparkles, CheckCheck, Calendar as CalendarIcon, Pencil, PenLine, Trash2, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LectureEditModal } from './LectureEditModal';

interface HomeScreenProps {
  user: UserProfile;
  timetable: Timetable;
  records: AttendanceRecord[];
  overrides: UserTimetableOverrides | null;
  onMarkAttendance: (lectureId: string, subjectCode: string, subjectName: string, status: AttendanceStatus) => void;
  onPresentAll: () => void;
  onOpenUploadTimetable: () => void;
  onEditLecture: (lectureId: string, dayOfWeek: string, override: LectureOverride) => void;
  onRevertLecture: (lectureId: string) => void;
  onAddLecture: (lectureId: string, dayOfWeek: string, newLecture: any) => void;
  onRemoveLecture: (lectureId: string, isUserAdded: boolean) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  timetable,
  records,
  overrides,
  onMarkAttendance,
  onPresentAll,
  onOpenUploadTimetable,
  onEditLecture,
  onRevertLecture,
  onAddLecture,
  onRemoveLecture,
}) => {
  const [editingSlot, setEditingSlot] = useState<{ slot: LectureSlot; dayOfWeek: string } | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

  // Get current day of week
  const todayObj = new Date();
  const todayDayName = todayObj.toLocaleDateString('en-US', { weekday: 'long' });
  const initialDay = daysOfWeek.includes(todayDayName as any) ? todayDayName : 'Monday';

  const [selectedDay, setSelectedDay] = useState<string>(initialDay);

  const todayDateStr = todayObj.toISOString().split('T')[0];
  const formattedTodayDate = todayObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const slots: LectureSlot[] = timetable.weeklySchedule[selectedDay as keyof typeof timetable.weeklySchedule] || [];

  const handlePresentAllClick = () => {
    onPresentAll();
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.85 },
      colors: ['#0066b1', '#1c69d4', '#e22718']
    });
  };

  const handleReportTemplate = async () => {
    const confirmReport = window.confirm(
      "Is this shared timetable incorrect? Flagging it will report it to the class template database and allow you to upload a new one."
    );
    if (!confirmReport) return;

    try {
      const response = await fetch('/api/report-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch: user.branch,
          year: user.year,
          semester: user.semester,
          section: user.section
        })
      });
      const data = await response.json();
      if (data.success) {
        alert("Timetable template reported. Let's upload a correct one!");
        onOpenUploadTimetable();
      } else {
        alert("Failed to report template. Opening upload options.");
        onOpenUploadTimetable();
      }
    } catch (err) {
      console.error("Failed to report template:", err);
      onOpenUploadTimetable();
    }
  };

  // Helper to find record status for a given slot on today
  const getSlotStatus = (slotId: string): AttendanceStatus | undefined => {
    const rec = records.find(r => r.date === todayDateStr && r.lectureId === slotId);
    return rec?.status;
  };

  const markedTodayCount = slots.filter(s => getSlotStatus(s.id) === 'Present').length;
  const isToday = selectedDay === todayDayName;

  return (
    <div className="space-y-6 pb-24 md:pb-12 font-bmw">
      {/* Clay Design Header Divider */}
      <div className="m-stripe" />

      {/* Today Greeting Banner */}
      <div className="bg-surface-soft border border-hairline rounded-lg p-6 text-ink relative shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-muted text-[10px] font-bold uppercase tracking-[0.5px] font-mono">
              <CalendarIcon className="w-3.5 h-3.5 text-text-link" />
              <span>{formattedTodayDate}</span>
            </div>
            <h2 className="text-2xl font-semibold text-ink tracking-tight">
              {user.name}
            </h2>
            <p className="text-xs text-muted font-normal">
              {user.branch} • YEAR {user.year} • SEC {user.section} • ROOM {timetable.roomNumber}
            </p>
          </div>

          {/* Today Stats pill */}
          <div className="bg-surface-card border border-hairline-strong p-4 flex items-center justify-between sm:justify-end space-x-6 min-w-[200px] rounded-md shadow-sm">
            <div className="space-y-1">
              <div className="text-[10px] text-muted tracking-[0.5px] font-semibold uppercase">Today's Progress</div>
              <div className="text-xl font-bold text-ink leading-none font-mono">
                {markedTodayCount} / {slots.length} CLS
              </div>
            </div>
            <div className="w-11 h-11 bg-primary text-white flex items-center justify-center font-bold text-xs rounded shadow-sm">
              {slots.length > 0 ? Math.round((markedTodayCount / slots.length) * 100) : 100}%
            </div>
          </div>
        </div>
      </div>

      {/* Week Day Picker */}
      <div className="bg-canvas-soft border border-hairline-strong p-1 rounded-md">
        <div className="flex items-center justify-between space-x-1 overflow-x-auto no-scrollbar">
          {daysOfWeek.map((day) => {
            const isSelected = selectedDay === day;
            const isActualToday = day === todayDayName;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 min-w-[85px] py-2 text-xs font-semibold transition-all rounded-sm cursor-pointer ${
                  isSelected
                    ? 'bg-canvas text-ink shadow-sm border border-hairline-strong font-bold'
                    : 'text-muted hover:bg-surface-card hover:text-ink'
                }`}
              >
                <div className="text-center">
                  <span>{day}</span>
                  {isActualToday && (
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ml-1 ${
                        isSelected ? 'bg-primary' : 'bg-[#ef4444]'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timetable Header Bar */}
      <div className="flex items-center justify-between border-b border-hairline-strong pb-4 px-1">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-ink flex items-center space-x-3 tracking-tight">
            <span>{selectedDay}'s Schedule</span>
            {isToday && (
              <span className="px-2 py-0.5 text-[9px] font-bold tracking-[0.5px] bg-surface-strong text-ink rounded-full">
                ACTIVE TODAY
              </span>
            )}
          </h3>
          <p className="text-xs text-muted font-normal">
            {slots.length} scheduled lectures configured
            {timetable.isSharedTemplate && (
              <span className="block mt-1 text-[11px] text-muted">
                Shared Template &bull;{' '}
                <button
                  onClick={handleReportTemplate}
                  className="text-red-500 hover:text-red-600 font-semibold cursor-pointer underline hover:no-underline bg-transparent border-0 p-0"
                >
                  Report Incorrect Timetable
                </button>
              </span>
            )}
          </p>
        </div>

        {isToday && slots.length > 0 && (
          <button
            onClick={handlePresentAllClick}
            className="hidden sm:flex items-center space-x-2 px-5 py-2.5 text-xs font-semibold rounded-md text-white bg-primary hover:bg-primary-active border-0 transition-all cursor-pointer shadow-sm"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Present</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {slots.length === 0 ? (
        <div className="bg-canvas-soft p-12 text-center border border-hairline-strong rounded-lg shadow-sm space-y-4">
          <div className="w-12 h-12 bg-canvas border border-hairline-strong text-muted flex items-center justify-center mx-auto rounded shadow-sm">
            <Sparkles className="w-5 h-5 text-text-link" />
          </div>
          <h4 className="text-base font-bold text-ink tracking-tight">
            No Lectures Configured for {selectedDay}
          </h4>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Review your timetable options or reload your schedule documentation sheet.
          </p>
          <button
            onClick={onOpenUploadTimetable}
            className="text-xs text-text-link font-semibold border-b border-text-link hover:text-text-link-secondary hover:border-text-link-secondary cursor-pointer pb-0.5 transition-colors"
          >
            Re-upload Timetable PDF →
          </button>
        </div>
      ) : (
        /* Technical Spec Card List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slots.map((slot, index) => {
            const currentStatus = isToday ? getSlotStatus(slot.id) : undefined;
            const isPresent = currentStatus === 'Present';
            const isAbsent = currentStatus === 'Absent';

            // Distinct border accent colors based on status
            let borderStyle = 'border-hairline-strong';
            if (isPresent) {
              borderStyle = 'border-green-300 dark:border-green-800 bg-green-500/5';
            } else if (isAbsent) {
              borderStyle = 'border-red-300 dark:border-red-800 bg-red-500/5';
            }

            return (
              <div
                key={slot.id || index}
                className={`bg-surface-card p-5 border transition-all duration-150 rounded-lg shadow-sm relative overflow-hidden ${borderStyle}`}
              >
                {/* Header Badge Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-8 h-8 bg-surface-strong text-ink text-[11px] font-bold flex items-center justify-center rounded font-mono shadow-sm">
                      L{slot.lectureNumber}
                    </span>
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-canvas-soft text-ink border border-hairline-strong rounded font-mono">
                      {slot.subjectCode}
                    </span>
                  {slot.isLab && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-surface-strong text-muted border border-hairline-strong rounded-full">
                        LAB {slot.batchSection ? `• ${slot.batchSection}` : ''}
                      </span>
                    )}
                    {overrides?.overrides?.[slot.id] && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-700/50 rounded-full flex items-center space-x-1">
                        <PenLine className="w-2.5 h-2.5" />
                        <span>Edited</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {/* Edit Button */}
                    <button
                      onClick={() => setEditingSlot({ slot, dayOfWeek: selectedDay })}
                      className="p-1.5 text-muted hover:text-text-link hover:bg-surface-soft rounded-md transition-all cursor-pointer border border-transparent hover:border-hairline-strong"
                      title="Edit this lecture (personal override)"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        const hasHistory = records.some(r => r.lectureId === slot.id);
                        const msg = hasHistory 
                          ? "This lecture has past attendance records. If you delete it, it will be hidden from your schedule going forward, but past records will be kept for analytics. Continue?"
                          : "Remove this lecture from your schedule? This won't affect other students.";
                        if (window.confirm(msg)) {
                          onRemoveLecture(slot.id, (slot as any).origin === 'user-added');
                        }
                      }}
                      className="p-1.5 text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-all cursor-pointer border border-transparent hover:border-red-200 dark:hover:border-red-900"
                      title="Remove this lecture"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  {/* Status Indicator Badge */}
                  {isToday && currentStatus && (
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-full flex items-center space-x-1.5 border ${
                        isPresent
                          ? 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-200/50'
                          : 'bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 border-red-200/50'
                      }`}
                    >
                      {isPresent ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>{currentStatus}</span>
                    </span>
                  )}
                  </div>
                </div>

                {/* Subject Name */}
                <h4 className="text-base font-semibold text-ink mt-4 leading-tight">
                  {slot.subjectName}
                </h4>

                {/* Meta Details Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-hairline-strong text-xs text-body">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-text-link shrink-0" />
                    <span className="font-normal font-mono">{slot.startTime} - {slot.endTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-muted shrink-0" />
                    <span className="font-normal truncate">{slot.roomNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2 col-span-2">
                    <User className="w-3.5 h-3.5 text-muted shrink-0" />
                    <span className="font-normal truncate">{slot.facultyName}</span>
                  </div>
                </div>

                {/* Present / Absent Action Buttons */}
                {isToday ? (
                  <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-hairline-strong">
                    <button
                      onClick={() =>
                         onMarkAttendance(slot.id, slot.subjectCode, slot.subjectName, 'Present')
                      }
                      className={`py-2 px-3 text-xs font-semibold transition-all rounded-md flex items-center justify-center space-x-1.5 cursor-pointer border ${
                        isPresent
                          ? 'bg-green-600 border-green-600 text-white shadow-sm'
                          : 'bg-canvas text-muted border-hairline-strong hover:border-muted hover:text-ink'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>Present</span>
                    </button>

                    <button
                      onClick={() =>
                        onMarkAttendance(slot.id, slot.subjectCode, slot.subjectName, 'Absent')
                      }
                      className={`py-2 px-3 text-xs font-semibold transition-all rounded-md flex items-center justify-center space-x-1.5 cursor-pointer border ${
                        isAbsent
                          ? 'bg-red-600 border-red-600 text-white shadow-sm'
                          : 'bg-canvas text-muted border-hairline-strong hover:border-muted hover:text-ink'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      <span>Absent</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 text-[10px] text-muted italic font-normal tracking-[0.5px]">
                    Schedule for {selectedDay}
                  </div>
                )}
              </div>
            );
          })}
          {/* Add Lecture Card Button */}
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-canvas-soft border-2 border-dashed border-hairline-strong hover:border-text-link hover:bg-surface-soft p-5 transition-all duration-150 rounded-lg flex flex-col items-center justify-center text-muted hover:text-text-link min-h-[220px] cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-surface-strong flex items-center justify-center mb-3">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-semibold tracking-tight text-sm">Add Lecture</span>
            <span className="text-xs mt-1 text-center font-normal px-4">
              Add a personal elective or extra class to {selectedDay}
            </span>
          </button>
        </div>
      )}

      {/* Floating Mobile "Present All" Button */}
      {isToday && slots.length > 0 && (
        <div className="sm:hidden fixed bottom-20 right-4 z-30">
          <button
            onClick={handlePresentAllClick}
            className="flex items-center space-x-2 bg-primary text-white px-5 py-3.5 font-semibold text-xs shadow-lg rounded-md cursor-pointer border-0"
          >
            <CheckCheck className="w-4 h-4 text-white" />
            <span>Present All</span>
          </button>
        </div>
      )}

      {/* Lecture Edit Modal */}
      {editingSlot && (
        <LectureEditModal
          isOpen={!!editingSlot}
          onClose={() => setEditingSlot(null)}
          slot={editingSlot.slot}
          existingOverride={overrides?.overrides?.[editingSlot.slot.id] || null}
          onSave={(override) => {
            onEditLecture(editingSlot.slot.id, editingSlot.dayOfWeek, override);
            setEditingSlot(null);
          }}
          onRevert={() => {
            onRevertLecture(editingSlot.slot.id);
            setEditingSlot(null);
          }}
        />
      )}

      {/* Add Lecture Modal */}
      {isAddingNew && (
        <LectureEditModal
          isOpen={isAddingNew}
          onClose={() => setIsAddingNew(false)}
          mode="add"
          defaultDayOfWeek={selectedDay}
          onSave={(newLecture, dayOfWeek) => {
            const newId = `added_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
            onAddLecture(newId, dayOfWeek || selectedDay, newLecture);
            setIsAddingNew(false);
          }}
        />
      )}
    </div>
  );
};
