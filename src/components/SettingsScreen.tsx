import React from 'react';
import { UserProfile, Timetable, UserTimetableOverrides } from '../types';
import { Sparkles, Moon, Sun, LogOut, RefreshCw, Smartphone, ShieldAlert, ArchiveRestore } from 'lucide-react';

interface SettingsScreenProps {
  user: UserProfile;
  theme: 'light' | 'dark';
  timetable: Timetable;
  overrides: UserTimetableOverrides | null;
  onToggleTheme: () => void;
  onOpenEditProfile: () => void;
  onOpenUploadTimetable: () => void;
  onResetData: () => void;
  onLogout: () => void;
  onRestoreLecture: (lectureId: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  theme,
  timetable,
  overrides,
  onToggleTheme,
  onOpenEditProfile,
  onOpenUploadTimetable,
  onResetData,
  onLogout,
  onRestoreLecture,
}) => {
  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-3xl mx-auto font-bmw">
      {/* Clay Design Header Stripe */}
      <div className="m-stripe" />

      {/* Profile Card */}
      <div className="bg-surface-card p-6 border border-hairline rounded-lg space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-primary text-white font-bold flex items-center justify-center text-xl rounded-md shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-ink tracking-tight">
                {user.name}
              </h3>
              <p className="text-xs text-muted font-normal">
                {user.email}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-canvas-soft border border-hairline-strong text-ink rounded font-mono">
                  {user.branch} • SEM {user.semester}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-canvas-soft border border-hairline-strong text-muted rounded font-mono">
                  SEC {user.section}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenEditProfile}
            className="px-4 py-2 bg-canvas text-ink border border-hairline-strong text-xs font-semibold rounded-md hover:bg-surface-soft hover:border-muted transition-all cursor-pointer shadow-sm"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Preferences & Configuration */}
      <div className="bg-surface-card p-6 border border-hairline rounded-lg space-y-4 shadow-sm">
        <h4 className="text-[10px] font-bold text-muted uppercase tracking-[1px] font-mono">
          System Preferences
        </h4>

        {/* Active theme switcher */}
        <div 
          onClick={onToggleTheme}
          className="flex items-center justify-between p-3.5 border border-hairline-strong bg-canvas rounded-md cursor-pointer hover:border-hairline transition-all shadow-sm"
        >
          <div className="flex items-center space-x-3">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-text-link" />
            ) : (
              <Sun className="w-5 h-5 text-text-link" />
            )}
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-ink block uppercase tracking-[0.5px]">
                THEME MODE ({theme.toUpperCase()})
              </span>
              <span className="text-[10px] text-muted font-normal">
                {theme === 'dark'
                  ? 'Pure dark cockpit mode for night performance'
                  : 'Clean high-contrast light mode for daytime tracking'}
              </span>
            </div>
          </div>

          <div className="w-12 h-6 bg-canvas-soft border border-hairline-strong p-0.5 rounded-full flex items-center cursor-pointer transition-all">
            <div className={`w-4 h-4 bg-primary rounded-full transition-all transform ${
              theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </div>
        </div>

        {/* Restore Hidden Lectures Section */}
        {overrides?.removedLectureIds && Object.keys(overrides.removedLectureIds).length > 0 && (
          <div className="bg-surface-card border border-hairline-strong rounded-lg overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-hairline-strong">
              <h3 className="text-sm font-bold text-ink tracking-tight flex items-center space-x-2">
                <ArchiveRestore className="w-4 h-4 text-primary" />
                <span>Hidden Lectures</span>
              </h3>
              <p className="text-xs text-muted mt-1">Lectures you have removed from your daily view.</p>
            </div>
            
            <div className="divide-y divide-hairline">
              {Object.keys(overrides.removedLectureIds).map(lectureId => {
                // Find the original lecture details from the timetable
                let originalSlot = null;
                for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const) {
                  const slot = timetable.weeklySchedule[day]?.find(s => s.id === lectureId);
                  if (slot) {
                    originalSlot = { ...slot, day };
                    break;
                  }
                }

                if (!originalSlot) return null;

                return (
                  <div key={lectureId} className="px-6 py-4 flex items-center justify-between hover:bg-canvas-soft transition-colors">
                    <div>
                      <div className="text-sm font-semibold text-ink">{originalSlot.subjectName} ({originalSlot.subjectCode})</div>
                      <div className="text-xs text-muted mt-0.5">
                        {originalSlot.day} • {originalSlot.startTime} - {originalSlot.endTime} • {originalSlot.facultyName}
                      </div>
                    </div>
                    <button
                      onClick={() => onRestoreLecture(lectureId)}
                      className="px-4 py-2 bg-canvas border border-hairline-strong hover:border-text-link hover:text-text-link text-ink text-xs font-semibold rounded-md shadow-sm cursor-pointer transition-colors"
                    >
                      Restore
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Timetable Re-upload */}
        <div
          onClick={onOpenUploadTimetable}
          className="flex items-center justify-between p-3.5 border border-hairline-strong bg-canvas rounded-md cursor-pointer hover:border-hairline transition-all shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-text-link" />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-ink block uppercase tracking-[0.5px]">
                Update Class Timetable
              </span>
              <span className="text-[10px] text-muted font-normal">
                Upload new official schedule document PDF/image
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-text-link uppercase tracking-[0.5px] border-b border-text-link pb-0.5 hover:text-text-link-secondary hover:border-text-link-secondary transition-colors">
            Upload PDF →
          </span>
        </div>
      </div>

      {/* PWA Mobile Optimization Banner */}
      <div className="bg-surface-soft p-6 border border-hairline rounded-lg space-y-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <Smartphone className="w-6 h-6 text-text-link" />
          <h4 className="text-xs font-bold text-ink uppercase tracking-[1px] font-mono">PWA DEPLOYMENT READY</h4>
        </div>
        <p className="text-xs text-muted font-normal leading-relaxed">
          Add AttendEase to your device's home screen for rapid response, offline performance, and real-time biometric synchronizations.
        </p>
      </div>

      {/* Account & Data Reset */}
      <div className="bg-surface-card p-6 border border-hairline rounded-lg space-y-4 shadow-sm">
        <h4 className="text-[10px] font-bold text-muted uppercase tracking-[1px] font-mono">
          Data Management
        </h4>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onResetData}
            className="flex-1 py-3 px-4 bg-canvas hover:bg-warning/10 text-warning border border-warning/50 font-bold text-xs tracking-[0.5px] uppercase rounded-md flex items-center justify-center space-x-2 transition-all w-full cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Logs</span>
          </button>

          <button
            onClick={onLogout}
            className="flex-1 py-3 px-4 bg-canvas hover:bg-red-500/10 text-red-600 border border-red-300 dark:border-red-800 font-bold text-xs tracking-[0.5px] uppercase rounded-md flex items-center justify-center space-x-2 transition-all w-full cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
