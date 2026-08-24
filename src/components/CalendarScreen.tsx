import React, { useState } from 'react';
import { AttendanceRecord, AttendanceStatus, Timetable } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, X, Clock, MapPin, Sparkles } from 'lucide-react';

interface CalendarScreenProps {
  records: AttendanceRecord[];
  timetable: Timetable;
  onMarkAttendanceOnDate: (dateStr: string, lectureId: string, subjectCode: string, subjectName: string, status: AttendanceStatus) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  records,
  timetable,
  onMarkAttendanceOnDate,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar matrix calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Days of week mapping for schedule lookup
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Helper to calculate status summary for a date
  const getDateStatusSummary = (dateStr: string) => {
    const dayRecords = records.filter(r => r.date === dateStr);
    if (dayRecords.length === 0) return null;

    const present = dayRecords.filter(r => r.status === 'Present').length;
    const absent = dayRecords.filter(r => r.status === 'Absent').length;

    if (present > 0 && absent === 0) return 'all-present';
    if (absent > 0 && present === 0) return 'all-absent';
    if (present > 0 && absent > 0) return 'partial';
    return 'none';
  };

  // Get selected day schedule and current attendance records
  const selectedDateObj = selectedDayDate ? new Date(selectedDayDate + 'T00:00:00') : new Date();
  const selectedDayName = dayNames[selectedDateObj.getDay()];
  const selectedDaySlots = timetable.weeklySchedule[selectedDayName as keyof typeof timetable.weeklySchedule] || [];

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Calendar Month Header & Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {monthNames[month]} {year}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tap any date to view lectures or edit logs
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
        </div>

        {/* Legend Pills */}
        <div className="flex items-center space-x-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Present</span>
          </div>
          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-400">Absent</span>
          </div>
          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-400">Partial</span>
          </div>
          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="text-slate-600 dark:text-slate-400">No Record</span>
          </div>
        </div>

        {/* Calendar Day Labels */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 py-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty leading cells */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-12 rounded-xl bg-slate-50/40 dark:bg-slate-900/30 opacity-40" />
          ))}

          {/* Month Day Cells */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const summary = getDateStatusSummary(dateStr);
            const isSelected = selectedDayDate === dateStr;
            const isToday = dateStr === new Date().toISOString().split('T')[0];

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDayDate(dateStr)}
                className={`h-12 rounded-xl flex flex-col items-center justify-between py-1.5 transition-all relative border ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 font-bold text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : isToday
                    ? 'border-indigo-300 dark:border-indigo-800 bg-slate-100/80 dark:bg-slate-800/80 font-bold text-slate-900 dark:text-white'
                    : 'border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <span className="text-xs">{dayNum}</span>

                {/* Dots indicator */}
                <div className="flex space-x-1">
                  {summary === 'all-present' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                  {summary === 'all-absent' && (
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                  )}
                  {summary === 'partial' && (
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Lecture Detail Drawer */}
      {selectedDayDate && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {selectedDayName}
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Lectures for {new Date(selectedDayDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </h4>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {selectedDaySlots.length} Classes
            </span>
          </div>

          {selectedDaySlots.length === 0 ? (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-xs">
              No lectures scheduled on {selectedDayName}
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDaySlots.map((slot) => {
                const rec = records.find(r => r.date === selectedDayDate && (r.lectureId === slot.id || r.subjectCode === slot.subjectCode));
                const currentStatus = rec?.status;

                return (
                  <div
                    key={slot.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 rounded">
                          {slot.subjectCode}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {slot.subjectName}
                      </h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {slot.facultyName} • {slot.roomNumber}
                      </p>
                    </div>

                    {/* Quick Toggle Buttons */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() =>
                          onMarkAttendanceOnDate(
                            selectedDayDate,
                            slot.id,
                            slot.subjectCode,
                            slot.subjectName,
                            'Present'
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                          currentStatus === 'Present'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Present</span>
                      </button>

                      <button
                        onClick={() =>
                          onMarkAttendanceOnDate(
                            selectedDayDate,
                            slot.id,
                            slot.subjectCode,
                            slot.subjectName,
                            'Absent'
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                          currentStatus === 'Absent'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-rose-50'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Absent</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
