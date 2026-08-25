import React, { useState } from 'react';
import { AttendanceRecord, AttendanceStatus, Timetable } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, X } from 'lucide-react';

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
    <div className="space-y-6 pb-24 md:pb-12 font-bmw">
      {/* Clay Design Header Stripe */}
      <div className="m-stripe" />

      {/* Calendar Month Header & Grid */}
      <div className="bg-surface-soft p-6 border border-hairline rounded-lg space-y-6 shadow-sm">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-canvas border border-hairline-strong text-text-link flex items-center justify-center font-bold rounded-md shadow-sm">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink tracking-tight">
                {monthNames[month]} {year}
              </h3>
              <p className="text-xs text-muted font-normal">
                Select a cell matrix date to inspect logs
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 border border-hairline bg-canvas text-ink hover:border-hairline-strong transition-colors rounded-md cursor-pointer shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 border border-hairline bg-canvas text-ink hover:border-hairline-strong transition-colors rounded-md cursor-pointer shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend Indicators */}
        <div className="flex items-center space-x-6 text-[10px] uppercase font-bold tracking-[0.5px] pt-3 border-t border-hairline overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-muted">Present</span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-muted">Absent</span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-warning" />
            <span className="text-muted">Partial</span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-muted" />
            <span className="text-muted">No Record</span>
          </div>
        </div>

        {/* Calendar Day Labels */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-muted uppercase tracking-[0.5px] border-b border-hairline pb-2">
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
            <div key={`empty-${idx}`} className="h-12 border border-hairline-soft bg-surface-soft/40 opacity-40 rounded-md" />
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
                className={`h-12 flex flex-col items-center justify-between py-1.5 transition-all relative border rounded-md cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary text-white font-bold shadow-sm'
                    : isToday
                    ? 'border-text-link bg-surface-soft text-ink font-bold shadow-sm'
                    : 'border-hairline bg-canvas hover:border-hairline-strong text-ink shadow-sm'
                }`}
              >
                <span className="text-xs font-semibold">{dayNum}</span>

                {/* Status dot */}
                <div className="flex space-x-1">
                  {summary === 'all-present' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  )}
                  {summary === 'all-absent' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                  {summary === 'partial' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Lecture Detail Drawer */}
      {selectedDayDate && (
        <div className="bg-surface-card p-6 border border-hairline rounded-lg space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-text-link uppercase tracking-[0.5px] block font-mono">
                {selectedDayName} SCHEDULE
              </span>
              <h4 className="text-lg font-bold text-ink">
                {new Date(selectedDayDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </h4>
            </div>
            <span className="text-xs font-bold tracking-[0.5px] px-2.5 py-1 bg-canvas-soft text-ink border border-hairline-strong rounded font-mono">
              {selectedDaySlots.length} CLASSES
            </span>
          </div>

          {selectedDaySlots.length === 0 ? (
            <div className="text-center py-8 text-muted text-xs font-normal">
              No classes configured for {selectedDayName}
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDaySlots.map((slot) => {
                const rec = records.find(r => r.date === selectedDayDate && r.lectureId === slot.id);
                const currentStatus = rec?.status;

                return (
                  <div
                    key={slot.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-hairline-strong bg-canvas-soft rounded-md shadow-sm gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-canvas text-ink border border-hairline-strong rounded font-mono">
                          {slot.subjectCode}
                        </span>
                        <span className="text-xs text-muted font-normal font-mono">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <h5 className="text-sm font-semibold text-ink">
                        {slot.subjectName}
                      </h5>
                      <p className="text-xs text-muted font-normal">
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
                        className={`px-4 py-2 text-xs font-semibold tracking-[0.5px] transition-all rounded-md flex items-center space-x-1 cursor-pointer border ${
                          currentStatus === 'Present'
                            ? 'bg-green-600 border-green-600 text-white shadow-sm'
                            : 'bg-canvas text-muted border-hairline-strong hover:border-muted hover:text-ink shadow-sm'
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
                        className={`px-4 py-2 text-xs font-semibold tracking-[0.5px] transition-all rounded-md flex items-center space-x-1 cursor-pointer border ${
                          currentStatus === 'Absent'
                            ? 'bg-red-600 border-red-600 text-white shadow-sm'
                            : 'bg-canvas text-muted border-hairline-strong hover:border-muted hover:text-ink shadow-sm'
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
