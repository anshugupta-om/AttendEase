import React, { useState } from 'react';
import { AttendanceRecord, UserProfile } from '../types';
import { Search, Filter, ShieldAlert, FileText, Check, X, Calendar, Clock, AlertCircle } from 'lucide-react';

interface HistoryScreenProps {
  user: UserProfile;
  records: AttendanceRecord[];
  onOpenDisputeModal: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ user, records, onOpenDisputeModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Present' | 'Absent'>('All');
  const [viewMode, setViewMode] = useState<'Day' | 'Subject'>('Day');

  // Filter records
  const filtered = records.filter(r => {
    const matchesSearch =
      r.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.date.includes(searchQuery);

    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Sort newest date first
  const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Top Claim Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
              Dispute Resolution Engine
            </span>
            <h3 className="text-xl font-bold mt-1 text-white">
              Attendance History & Claims
            </h3>
            <p className="text-xs text-slate-300 max-w-lg mt-0.5">
              Found a mismatch in official college portal attendance? Export verified timestamped proofs to claim your attendance corrections from HOD.
            </p>
          </div>

          <button
            onClick={onOpenDisputeModal}
            className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-indigo-600/30 transition-all shrink-0 active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 text-indigo-200" />
            <span>Generate Claim Report</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by subject code, name or date (e.g. CS301)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['All', 'Present', 'Absent'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedStatus === st
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Table / Card List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Attendance Logs ({sorted.length})
          </h4>
          <span className="text-xs text-slate-500">
            Sorted by Most Recent
          </span>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
            <p>No matching attendance records found.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sorted.map((rec) => {
              const formattedDate = new Date(rec.date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              const isPresent = rec.status === 'Present';

              return (
                <div
                  key={rec.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isPresent
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {isPresent ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 rounded">
                          {rec.subjectCode}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-xs">
                          {rec.subjectName}
                        </h5>
                      </div>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{formattedDate}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${
                        isPresent
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
