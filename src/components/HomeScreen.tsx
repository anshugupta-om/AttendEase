import React, { useState } from 'react';
import { AttendanceRecord, AttendanceStatus, LectureSlot, Timetable, UserProfile } from '../types';
import { Check, X, Clock, MapPin, User, Sparkles, CheckCheck, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HomeScreenProps {
  user: UserProfile;
  timetable: Timetable;
  records: AttendanceRecord[];
  onMarkAttendance: (lectureId: string, subjectCode: string, subjectName: string, status: AttendanceStatus) => void;
  onPresentAll: () => void;
  onOpenUploadTimetable: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  timetable,
  records,
  onMarkAttendance,
  onPresentAll,
  onOpenUploadTimetable,
}) => {
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
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#4f46e5', '#10b981', '#6366f1']
    });
  };

  // Helper to find record status for a given slot on today
  const getSlotStatus = (slotId: string, subjectCode: string): AttendanceStatus | undefined => {
    const rec = records.find(r => r.date === todayDateStr && (r.lectureId === slotId || r.subjectCode === subjectCode));
    return rec?.status;
  };

  const markedTodayCount = slots.filter(s => getSlotStatus(s.id, s.subjectCode) === 'Present').length;
  const isToday = selectedDay === todayDayName;

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Today Greeting Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-indigo-950/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{formattedTodayDate}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Hello, {user.name.split(' ')[0]} 👋
            </h2>
            <p className="text-sm text-indigo-200 mt-1">
              {user.branch} • Year {user.year} • Section {user.section} • Room {timetable.roomNumber}
            </p>
          </div>

          {/* Today Stats pill */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 flex items-center justify-between sm:justify-end space-x-4 min-w-[180px]">
            <div>
              <div className="text-[11px] text-indigo-200 font-medium">Today's Progress</div>
              <div className="text-lg font-bold text-white">
                {markedTodayCount} / {slots.length} Classes
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/80 flex items-center justify-center text-white font-bold text-sm">
              {slots.length > 0 ? Math.round((markedTodayCount / slots.length) * 100) : 100}%
            </div>
          </div>
        </div>
      </div>

      {/* Week Day Picker */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between space-x-1 overflow-x-auto no-scrollbar py-1 px-1">
          {daysOfWeek.map((day) => {
            const isSelected = selectedDay === day;
            const isActualToday = day === todayDayName;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 min-w-[85px] py-2.5 px-3 rounded-xl text-xs font-semibold transition-all relative ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-center">
                  <span className="block truncate">{day.substring(0, 3)}</span>
                  {isActualToday && (
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full mt-1 ${
                        isSelected ? 'bg-white' : 'bg-indigo-600'
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
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>{selectedDay}'s Classes</span>
            {isToday && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-800">
                TODAY
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {slots.length} scheduled lectures for {user.branch} Section {user.section}
          </p>
        </div>

        {isToday && slots.length > 0 && (
          <button
            onClick={handlePresentAllClick}
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Present</span>
          </button>
        )}
      </div>

      {/* Empty State if no classes */}
      {slots.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            No Classes Scheduled for {selectedDay}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Enjoy your free day or review your timetable settings.
          </p>
          <button
            onClick={onOpenUploadTimetable}
            className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Re-upload Timetable PDF →
          </button>
        </div>
      ) : (
        /* Lecture Cards List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slots.map((slot, index) => {
            const currentStatus = isToday ? getSlotStatus(slot.id, slot.subjectCode) : undefined;
            const isPresent = currentStatus === 'Present';
            const isAbsent = currentStatus === 'Absent';

            return (
              <div
                key={slot.id || index}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all duration-200 shadow-sm relative overflow-hidden ${
                  isPresent
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : isAbsent
                    ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50/20 dark:bg-rose-950/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800'
                }`}
              >
                {/* Lecture Number Badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center">
                      L{slot.lectureNumber}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
                      {slot.subjectCode}
                    </span>
                    {slot.isLab && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-md">
                        LAB {slot.batchSection ? `• ${slot.batchSection}` : ''}
                      </span>
                    )}
                  </div>

                  {/* Status Indicator Pill */}
                  {isToday && currentStatus && (
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center space-x-1 ${
                        isPresent
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {isPresent ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{currentStatus}</span>
                    </span>
                  )}
                </div>

                {/* Subject Name */}
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-3 leading-snug">
                  {slot.subjectName}
                </h4>

                {/* Meta Details Grid */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{slot.roomNumber}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 col-span-2">
                    <User className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{slot.facultyName}</span>
                  </div>
                </div>

                {/* Present / Absent Toggle Buttons (Only active for today's view) */}
                {isToday ? (
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() =>
                        onMarkAttendance(slot.id, slot.subjectCode, slot.subjectName, 'Present')
                      }
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                        isPresent
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>Present</span>
                    </button>

                    <button
                      onClick={() =>
                        onMarkAttendance(slot.id, slot.subjectCode, slot.subjectName, 'Absent')
                      }
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                        isAbsent
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/50 dark:hover:text-rose-300'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      <span>Absent</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 text-[11px] text-slate-400 italic">
                    Viewing {selectedDay}'s schedule
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Mobile "Present All" Button */}
      {isToday && slots.length > 0 && (
        <div className="sm:hidden fixed bottom-20 right-4 z-30">
          <button
            onClick={handlePresentAllClick}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-5 py-3 rounded-full font-bold text-xs shadow-xl shadow-emerald-600/40 active:scale-95 transition-transform"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Present All Today</span>
          </button>
        </div>
      )}
    </div>
  );
};
