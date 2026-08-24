import React from 'react';
import { UserProfile } from '../types';
import { User, Sparkles, Moon, Sun, Shield, LogOut, Trash2, Smartphone, RefreshCw, Check } from 'lucide-react';

interface SettingsScreenProps {
  user: UserProfile;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenEditProfile: () => void;
  onOpenUploadTimetable: () => void;
  onResetData: () => void;
  onLogout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  theme,
  onToggleTheme,
  onOpenEditProfile,
  onOpenUploadTimetable,
  onResetData,
  onLogout,
}) => {
  return (
    <div className="space-y-6 pb-20 md:pb-10 max-w-3xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black flex items-center justify-center text-xl shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {user.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.email}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 rounded-full">
                  {user.branch} • Sem {user.semester}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full">
                  Section {user.section}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenEditProfile}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Preferences & Theme */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs text-slate-400">
          Preferences
        </h4>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-3">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-amber-400" />
            ) : (
              <Sun className="w-5 h-5 text-slate-600" />
            )}
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Dark Mode Theme
              </span>
              <span className="text-[11px] text-slate-500">
                {theme === 'dark' ? 'Dark theme enabled' : 'Light theme enabled'}
              </span>
            </div>
          </div>

          <button
            onClick={onToggleTheme}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Timetable Re-upload */}
        <div
          onClick={onOpenUploadTimetable}
          className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Update Class Timetable
              </span>
              <span className="text-[11px] text-slate-500">
                Upload new official timetable PDF
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            Upload PDF →
          </span>
        </div>
      </div>

      {/* PWA Mobile Optimization Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-6 text-white space-y-3">
        <div className="flex items-center space-x-3">
          <Smartphone className="w-6 h-6 text-indigo-300" />
          <h4 className="text-sm font-bold">Progressive Web App (PWA) Ready</h4>
        </div>
        <p className="text-xs text-indigo-200">
          Add AttendEase to your phone's Home Screen for instant native-app like access and offline attendance logging!
        </p>
      </div>

      {/* Account & Data Reset */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Data Management
        </h4>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onResetData}
            className="flex-1 py-2.5 px-4 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-200 dark:border-amber-900 flex items-center justify-center space-x-2 transition-colors w-full"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Attendance History</span>
          </button>

          <button
            onClick={onLogout}
            className="flex-1 py-2.5 px-4 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-800 dark:text-rose-300 font-bold text-xs rounded-xl border border-rose-200 dark:border-rose-900 flex items-center justify-center space-x-2 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
