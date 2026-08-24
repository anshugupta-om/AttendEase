/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AttendanceRecord, AttendanceStatus, NavTab, Timetable, UserProfile } from './types';
import {
  defaultUser,
  getAttendanceRecords,
  getTimetable,
  getUserProfile,
  initializeDemoHistory,
  markTodayAllPresent,
  recordAttendance,
  saveAttendanceRecords,
  saveTimetable,
  saveUserProfile,
  clearAllData,
} from './lib/storage';
import { Header } from './components/Header';
import { NavTab as TabType, Navigation } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AuthModal } from './components/AuthModal';
import { ProfileSetupModal } from './components/ProfileSetupModal';
import { TimetableUploadModal } from './components/TimetableUploadModal';
import { PdfExportModal } from './components/PdfExportModal';
import { DisputeClaimModal } from './components/DisputeClaimModal';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [timetable, setTimetable] = useState<Timetable>(getTimetable());
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState(false);
  const [isUploadTimetableOpen, setIsUploadTimetableOpen] = useState(false);
  const [isPdfExportOpen, setIsPdfExportOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  // Initialize on mount
  useEffect(() => {
    const profile = getUserProfile();
    const tt = getTimetable();
    setTimetable(tt);

    if (profile) {
      setUser(profile);
      initializeDemoHistory(profile.id, tt);
    } else {
      // Default to logged-in demo user for instant usability
      const demo = defaultUser;
      setUser(demo);
      saveUserProfile(demo);
      initializeDemoHistory(demo.id, tt);
    }

    setRecords(getAttendanceRecords());

    // Check system or stored theme
    const storedTheme = localStorage.getItem('attendease_theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('attendease_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleMarkAttendance = (
    lectureId: string,
    subjectCode: string,
    subjectName: string,
    status: AttendanceStatus
  ) => {
    if (!user) return;
    const todayStr = new Date().toISOString().split('T')[0];
    recordAttendance(user.id, todayStr, lectureId, subjectCode, subjectName, status);
    setRecords(getAttendanceRecords());
  };

  const handleMarkAttendanceOnDate = (
    dateStr: string,
    lectureId: string,
    subjectCode: string,
    subjectName: string,
    status: AttendanceStatus
  ) => {
    if (!user) return;
    recordAttendance(user.id, dateStr, lectureId, subjectCode, subjectName, status);
    setRecords(getAttendanceRecords());
  };

  const handlePresentAll = () => {
    if (!user) return;
    const todayObj = new Date();
    const todayStr = todayObj.toISOString().split('T')[0];
    const dayName = todayObj.toLocaleDateString('en-US', { weekday: 'long' });

    markTodayAllPresent(user.id, timetable, todayStr, dayName);
    setRecords(getAttendanceRecords());
  };

  const handleTimetableParsed = (newTimetable: Timetable) => {
    setTimetable(newTimetable);
    saveTimetable(newTimetable);
  };

  const handleSaveProfile = (profile: UserProfile) => {
    setUser(profile);
    saveUserProfile(profile);
    setIsProfileSetupOpen(false);
  };

  const handleLogout = () => {
    clearAllData();
    setUser(null);
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (loginUser: UserProfile) => {
    setUser(loginUser);
    saveUserProfile(loginUser);
    initializeDemoHistory(loginUser.id, timetable);
    setRecords(getAttendanceRecords());
    setIsAuthOpen(false);
  };

  const handleResetDemoData = () => {
    localStorage.removeItem('attendease_attendance_records');
    localStorage.removeItem('attendease_demo_initialized');
    if (user) {
      initializeDemoHistory(user.id, timetable);
    }
    setRecords(getAttendanceRecords());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Sticky Header */}
      <Header
        user={user}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenPdfExport={() => setIsPdfExportOpen(true)}
        onOpenUploadTimetable={() => setIsUploadTimetableOpen(true)}
        onOpenProfile={() => setIsProfileSetupOpen(true)}
      />

      {/* Navigation Bar */}
      <Navigation activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {user && activeTab === 'home' && (
          <HomeScreen
            user={user}
            timetable={timetable}
            records={records}
            onMarkAttendance={handleMarkAttendance}
            onPresentAll={handlePresentAll}
            onOpenUploadTimetable={() => setIsUploadTimetableOpen(true)}
          />
        )}

        {user && activeTab === 'dashboard' && (
          <DashboardScreen user={user} timetable={timetable} records={records} />
        )}

        {user && activeTab === 'calendar' && (
          <CalendarScreen
            records={records}
            timetable={timetable}
            onMarkAttendanceOnDate={handleMarkAttendanceOnDate}
          />
        )}

        {user && activeTab === 'history' && (
          <HistoryScreen
            user={user}
            records={records}
            onOpenDisputeModal={() => setIsDisputeModalOpen(true)}
          />
        )}

        {user && activeTab === 'settings' && (
          <SettingsScreen
            user={user}
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenEditProfile={() => setIsProfileSetupOpen(true)}
            onOpenUploadTimetable={() => setIsUploadTimetableOpen(true)}
            onResetData={handleResetDemoData}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onLoginSuccess={handleLoginSuccess} />

      <ProfileSetupModal
        isOpen={isProfileSetupOpen}
        initialData={user}
        onSave={handleSaveProfile}
      />

      <TimetableUploadModal
        isOpen={isUploadTimetableOpen}
        onClose={() => setIsUploadTimetableOpen(false)}
        onTimetableParsed={handleTimetableParsed}
      />

      <PdfExportModal
        isOpen={isPdfExportOpen}
        onClose={() => setIsPdfExportOpen(false)}
        user={user || defaultUser}
        timetable={timetable}
        records={records}
      />

      <DisputeClaimModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        user={user || defaultUser}
        timetable={timetable}
        records={records}
      />
    </div>
  );
}
