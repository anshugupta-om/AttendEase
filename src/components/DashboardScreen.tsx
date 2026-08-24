import React from 'react';
import { AttendanceRecord, Timetable, UserProfile } from '../types';
import { calculateAnalytics } from '../lib/analytics';
import { Award, AlertTriangle, CheckCircle2, TrendingUp, BookOpen, Layers, Target } from 'lucide-react';

interface DashboardScreenProps {
  user: UserProfile;
  timetable: Timetable;
  records: AttendanceRecord[];
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, timetable, records }) => {
  const { subjectSummaries, stats } = calculateAnalytics(records, timetable);

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Top Banner Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Main Percentage Circle / Gauge */}
          <div className="flex items-center space-x-6">
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-100 dark:text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={301.59}
                  strokeDashoffset={301.59 - (301.59 * stats.overallPercentage) / 100}
                  strokeLinecap="round"
                  className={
                    stats.overallPercentage >= 75
                      ? 'text-emerald-500'
                      : stats.overallPercentage >= 60
                      ? 'text-amber-500'
                      : 'text-rose-500'
                  }
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">
                  {stats.overallPercentage}%
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">
                  Overall
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Attendance Score
                </h3>
                {stats.overallPercentage >= 75 ? (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Eligible</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded-full flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>At Risk (&lt;75%)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                Target is 75% required by college guidelines for exam eligibility.
              </p>
            </div>
          </div>

          {/* Core Stat Numbers */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="text-center">
              <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Total Classes
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {stats.totalLectures}
              </span>
            </div>
            <div className="text-center border-x border-slate-200 dark:border-slate-700 px-2">
              <span className="block text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Attended
              </span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {stats.totalAttended}
              </span>
            </div>
            <div className="text-center">
              <span className="block text-[11px] font-medium text-rose-500 dark:text-rose-400">
                Missed
              </span>
              <span className="text-lg font-bold text-rose-500 dark:text-rose-400">
                {stats.totalMissed}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Trend Tiles */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/60 dark:border-indigo-900/40">
            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Today
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {stats.todayPercentage}%
            </span>
          </div>

          <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-100/60 dark:border-purple-900/40">
            <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
              Weekly
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {stats.weeklyPercentage}%
            </span>
          </div>

          <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100/60 dark:border-blue-900/40">
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              Monthly
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {stats.monthlyPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Subject Wise Analytics Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Subject Wise Analytics</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed performance, progress bar, and margin calculator
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjectSummaries.map((sub) => (
            <div
              key={sub.subjectCode}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 rounded">
                    {sub.subjectCode}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                    {sub.subjectName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {sub.facultyName}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xl font-extrabold ${
                      sub.statusColor === 'green'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : sub.statusColor === 'yellow'
                        ? 'text-amber-500'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {sub.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sub.statusColor === 'green'
                        ? 'bg-emerald-500'
                        : sub.statusColor === 'yellow'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Attended: {sub.attended} / {sub.totalLectures}</span>
                  <span>Missed: {sub.missed}</span>
                </div>
              </div>

              {/* Target / Recovery Calculator Badge */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                {sub.percentage >= 75 ? (
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200/50 dark:border-emerald-900/40">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Safely above 75% criteria</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 text-xs text-rose-700 dark:text-rose-300 font-medium bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-xl border border-rose-200/50 dark:border-rose-900/40">
                    <Target className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                    <span>
                      Need next <strong className="underline">{sub.lecturesNeededFor75}</strong> consecutive classes to reach 75%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
