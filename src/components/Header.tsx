import React from 'react';
import { UserProfile } from '../types';
import { Sun, Moon, Sparkles, FileText, User } from 'lucide-react';

interface HeaderProps {
  user: UserProfile | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenPdfExport: () => void;
  onOpenUploadTimetable: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  theme,
  onToggleTheme,
  onOpenPdfExport,
  onOpenUploadTimetable,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onOpenProfile}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <span className="font-extrabold text-xl tracking-wider">AE</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                AttendEase
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Smart Student Tracker
            </p>
          </div>
        </div>

        {/* User Badge & Quick Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {user && (
            <div 
              onClick={onOpenProfile}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
                {user.name ? user.name.charAt(0) : 'S'}
              </div>
              <div className="text-xs text-left">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[120px]">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {user.branch} • Sem {user.semester}
                </span>
              </div>
            </div>
          )}

          {/* Upload Timetable Button */}
          <button
            onClick={onOpenUploadTimetable}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-slate-200/80 dark:border-slate-700"
            title="Upload Official Timetable PDF"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden md:inline">Upload Timetable</span>
            <span className="md:hidden">Upload</span>
          </button>

          {/* Export PDF Button */}
          <button
            onClick={onOpenPdfExport}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all active:scale-95"
            title="Export Attendance PDF Report"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
