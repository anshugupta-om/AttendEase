import React from 'react';
import { AttendanceRecord, Timetable, UserProfile } from '../types';
import { calculateAnalytics } from '../lib/analytics';
import { AlertTriangle, CheckCircle, BookOpen, Target } from 'lucide-react';

interface DashboardScreenProps {
  user: UserProfile;
  timetable: Timetable;
  records: AttendanceRecord[];
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, timetable, records }) => {
  const { subjectSummaries, stats } = calculateAnalytics(records, timetable);

  return (
    <div className="space-y-6 pb-24 md:pb-12 font-bmw">
      {/* Top Banner Overview */}
      <div className="bg-surface-soft p-6 border border-hairline rounded-lg space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Main Percentage Gauge */}
          <div className="flex items-center space-x-6">
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-hairline"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={251.32}
                  strokeDashoffset={251.32 - (251.32 * stats.overallPercentage) / 100}
                  className={
                    stats.overallPercentage >= 75
                      ? 'text-[#16a34a]'
                      : stats.overallPercentage >= 60
                      ? 'text-warning'
                      : 'text-[#eb8e90]'
                  }
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-ink leading-none font-mono">
                  {stats.overallPercentage}%
                </span>
                <span className="text-[9px] font-bold text-muted tracking-[0.5px] uppercase mt-1">
                  OVERALL
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-ink tracking-tight">
                  ATTENDANCE SCORE
                </h3>
                {stats.overallPercentage >= 75 ? (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-200/50 rounded-full">
                    ELIGIBLE
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 border border-red-200/50 rounded-full">
                    AT RISK
                  </span>
                )}
              </div>
              <p className="text-xs text-muted font-normal max-w-sm leading-relaxed">
                Target is 75% required by official academic guidelines for semester exam eligibility.
              </p>
            </div>
          </div>

          {/* Metrics block */}
          <div className="grid grid-cols-3 gap-4 bg-surface-card p-4 border border-hairline-strong rounded-md min-w-[280px] shadow-sm">
            <div className="text-center space-y-1">
              <span className="block text-[9px] font-bold text-muted tracking-[0.5px] uppercase">
                TOTAL CLASSES
              </span>
              <span className="text-xl font-bold text-ink leading-none font-mono">
                {stats.totalLectures}
              </span>
            </div>
            <div className="text-center border-x border-hairline-strong px-2 space-y-1">
              <span className="block text-[9px] font-bold text-muted tracking-[0.5px] uppercase">
                ATTENDED
              </span>
              <span className="text-xl font-bold text-[#16a34a] leading-none font-mono">
                {stats.totalAttended}
              </span>
            </div>
            <div className="text-center space-y-1">
              <span className="block text-[9px] font-bold text-muted tracking-[0.5px] uppercase">
                MISSED
              </span>
              <span className="text-xl font-bold text-[#eb8e90] leading-none font-mono">
                {stats.totalMissed}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Trend Tiles */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-hairline">
          <div className="p-3 bg-surface-card border border-hairline-strong rounded-md text-center shadow-sm">
            <span className="text-[9px] font-bold text-muted tracking-[0.5px] block mb-1">
              TODAY
            </span>
            <span className="text-lg font-bold text-ink leading-none font-mono">
              {stats.todayPercentage}%
            </span>
          </div>

          <div className="p-3 bg-surface-card border border-hairline-strong rounded-md text-center shadow-sm">
            <span className="text-[9px] font-bold text-muted tracking-[0.5px] block mb-1">
              WEEKLY
            </span>
            <span className="text-lg font-bold text-ink leading-none font-mono">
              {stats.weeklyPercentage}%
            </span>
          </div>

          <div className="p-3 bg-surface-card border border-hairline-strong rounded-md text-center shadow-sm">
            <span className="text-[9px] font-bold text-muted tracking-[0.5px] block mb-1">
              MONTHLY
            </span>
            <span className="text-lg font-bold text-ink leading-none font-mono">
              {stats.monthlyPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Subject Wise Analytics Section */}
      <div className="space-y-4">
        <div className="border-b border-hairline-strong pb-3 px-1">
          <h3 className="text-lg font-bold text-ink flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-text-link" />
            <span>SUBJECT PERFORMANCE</span>
          </h3>
          <p className="text-xs text-muted font-normal">
            Detailed calculations, class counts, and recovery guidelines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjectSummaries.map((sub) => (
            <div
              key={sub.subjectCode}
              className="bg-surface-card p-5 border border-hairline-strong rounded-lg space-y-4 hover:border-hairline-strong transition-colors shadow-sm"
            >
              {/* Header Details */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-canvas-soft text-ink border border-hairline-strong rounded font-mono">
                    {sub.subjectCode}
                  </span>
                  <h4 className="text-sm font-semibold text-ink tracking-tight mt-1 leading-snug">
                    {sub.subjectName}
                  </h4>
                  <p className="text-xs text-muted font-normal">
                    {sub.facultyName}
                  </p>
                </div>

                <div className="text-right font-mono">
                  <span
                    className={`text-xl font-bold ${
                      sub.statusColor === 'green'
                        ? 'text-[#16a34a]'
                        : sub.statusColor === 'yellow'
                        ? 'text-warning'
                        : 'text-[#eb8e90]'
                    }`}
                  >
                    {sub.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-canvas-soft h-2 rounded-full border border-hairline-strong overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sub.statusColor === 'green'
                        ? 'bg-[#16a34a]'
                        : sub.statusColor === 'yellow'
                        ? 'bg-warning'
                        : 'bg-[#eb8e90]'
                    }`}
                    style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted font-semibold uppercase tracking-[0.5px]">
                  <span>Attended: {sub.attended} / {sub.totalLectures}</span>
                  <span>Missed: {sub.missed}</span>
                </div>
              </div>

              {/* Target / Recovery Calculator Badge */}
              <div className="pt-3 border-t border-hairline-strong">
                {sub.percentage >= 75 ? (
                  <div className="flex items-center space-x-2 text-xs text-green-700 bg-green-50 dark:bg-green-950/40 px-3 py-2 rounded-md border border-green-200/50 font-semibold shadow-sm">
                    <CheckCircle className="w-4 h-4 shrink-0 text-green-600 dark:text-green-400" />
                    <span>Safely above exam criteria threshold</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-xs text-red-700 bg-red-50 dark:bg-red-950/40 px-3 py-2 rounded-md border border-red-200/50 font-semibold shadow-sm">
                    <Target className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
                    <span>
                      Need next <strong className="underline font-mono">{sub.lecturesNeededFor75}</strong> consecutive classes to reach 75%
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
