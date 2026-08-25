import React, { useState } from 'react';
import { AttendanceRecord, UserProfile } from '../types';
import { Search, ShieldAlert, Check, X, Calendar, Clock, AlertCircle } from 'lucide-react';

interface HistoryScreenProps {
  user: UserProfile;
  records: AttendanceRecord[];
  onOpenDisputeModal: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ user, records, onOpenDisputeModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Present' | 'Absent'>('All');

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
    <div className="space-y-6 pb-24 md:pb-12 font-bmw">
      {/* Clay Design Header Stripe */}
      <div className="m-stripe" />

      {/* Top Claim Banner */}
      <div className="bg-surface-soft p-6 border border-hairline rounded-lg space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-surface-strong text-ink border border-hairline-strong rounded-full">
              Dispute Resolution Engine
            </span>
            <h3 className="text-xl font-semibold text-ink mt-2">
              Attendance History & Claims
            </h3>
            <p className="text-xs text-muted font-normal leading-relaxed max-w-lg">
              Found a mismatch in official college portal attendance? Export verified timestamped proofs to claim your attendance corrections from HOD.
            </p>
          </div>

          <button
            onClick={onOpenDisputeModal}
            className="flex items-center justify-center space-x-2 bg-primary text-white px-5 py-3 rounded-md font-semibold text-xs hover:bg-primary-active transition-all shrink-0 cursor-pointer shadow-md border-0"
          >
            <ShieldAlert className="w-4 h-4 text-text-link" />
            <span>Generate Claim Report</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface-soft p-4 border border-hairline rounded-lg space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by subject code, name or date (e.g. CS301)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-canvas border border-hairline-strong rounded-md text-xs text-ink focus:outline-none focus:border-text-link tracking-[0.5px]"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1 bg-canvas-soft p-1 border border-hairline-strong rounded-md">
            {(['All', 'Present', 'Absent'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-4 py-2 text-xs font-semibold tracking-[0.5px] transition-all rounded-sm cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-canvas text-ink shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-surface-soft p-6 border border-hairline rounded-lg space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-hairline">
          <h4 className="text-base font-bold text-ink">
            Attendance Logs ({sorted.length})
          </h4>
          <span className="text-[10px] text-muted font-bold uppercase tracking-[0.5px]">
            Sorted by Most Recent
          </span>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-12 text-muted text-xs font-normal space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto text-muted animate-pulse" />
            <p className="tracking-[0.5px]">No matching records found</p>
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
                  className="flex items-center justify-between p-3.5 border border-hairline bg-canvas rounded-md hover:border-hairline-strong transition-colors shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-9 h-9 flex items-center justify-center font-bold text-xs shrink-0 rounded ${
                        isPresent
                          ? 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-200/50'
                          : 'bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 border border-red-200/50'
                      }`}
                    >
                      {isPresent ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-surface-soft text-ink border border-hairline-strong rounded font-mono">
                          {rec.subjectCode}
                        </span>
                        <h5 className="text-xs font-semibold text-ink truncate max-w-[180px] sm:max-w-xs">
                          {rec.subjectName}
                        </h5>
                      </div>
                      <div className="flex items-center space-x-4 text-[10px] text-muted font-normal tracking-[0.5px]">
                        <span className="flex items-center space-x-1.5 font-mono">
                          <Calendar className="w-3 h-3 text-text-link" />
                          <span>{formattedDate}</span>
                        </span>
                        <span className="flex items-center space-x-1.5 font-mono">
                          <Clock className="w-3 h-3 text-muted" />
                          <span>{new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-3 py-1 text-[10px] font-bold rounded-full inline-block border ${
                        isPresent
                          ? 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-200/50'
                          : 'bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 border-red-200/50'
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
