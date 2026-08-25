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
    <header className="sticky top-0 z-30 bg-canvas/85 backdrop-blur-md border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Expo Brand Logo & Label */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onOpenProfile}>
          <div className="flex flex-col space-y-0.5">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white font-bold text-xs shadow-sm transition-transform hover:scale-105 shrink-0">
                AE
              </div>
              <span className="text-sm font-semibold tracking-[-0.5px] text-ink font-bmw">
                AttendEase <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-surface-strong border border-hairline-strong text-ink">GTC</span>
              </span>
            </div>
            <span className="text-[10px] text-muted tracking-[0.5px] font-normal pl-0.5">
              Attendance Orchestration
            </span>
          </div>
        </div>

        {/* User Badge & Actions */}
        <div className="flex items-center space-x-3">
          {user && (
            <div 
              onClick={onOpenProfile}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-surface-card border border-hairline-strong hover:border-hairline cursor-pointer transition-all rounded-md shadow-sm"
            >
              <div className="w-5 h-5 bg-primary text-white flex items-center justify-center text-[10px] font-bold rounded">
                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs font-semibold text-ink block max-w-[120px] truncate">
                  {user.name}
                </span>
                <span className="text-[9px] text-muted block font-normal">
                  {user.branch} • SEM {user.semester}
                </span>
              </div>
            </div>
          )}

          {/* Upload Timetable (Primary style button) */}
          <button
            onClick={onOpenUploadTimetable}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-md text-white bg-primary hover:bg-primary-active transition-all cursor-pointer shadow-sm border-0"
            title="Upload Official Timetable PDF"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Upload Timetable</span>
            <span className="md:hidden">Upload</span>
          </button>

          {/* Export PDF (Surface card action style) */}
          <button
            onClick={onOpenPdfExport}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-md text-ink bg-surface-card border border-hairline-strong hover:bg-surface-elevated transition-all cursor-pointer shadow-sm"
            title="Export Attendance PDF Report"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          {/* Low-profile theme indicator */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-md bg-canvas text-muted hover:text-ink border border-hairline hover:border-hairline-strong transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
