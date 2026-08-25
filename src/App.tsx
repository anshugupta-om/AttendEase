/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AttendanceRecord, AttendanceStatus, Timetable, UserProfile } from './types';
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
import { auth } from './lib/firebase';
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
import { LandingPage } from './components/LandingPage';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [timetable, setTimetable] = useState<Timetable>(getTimetable());
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('attendease_theme_preference');
    return (stored === 'light' || stored === 'dark') ? stored : 'dark';
  });

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState(false);
  const [isUploadTimetableOpen, setIsUploadTimetableOpen] = useState(false);
  const [isPdfExportOpen, setIsPdfExportOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  // Initialize and listen to Firebase auth state changes on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // Load or create UserProfile for this specific authenticated user
        let profile = getUserProfile(firebaseUser.uid);
        if (!profile) {
          profile = {
            id: firebaseUser.uid,
            firebaseUid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Student',
            email: firebaseUser.email || '',
            branch: 'AIML',
            year: 'Second Year',
            semester: 3,
            section: 'A',
            collegeName: 'National Institute of Technology',
            firstTimeSetupCompleted: false, // Forces setup modal trigger
            themePreference: 'light'
          };
          saveUserProfile(profile);
        }
        
        setUser(profile);

        // Sync theme with user profile preference
        const userTheme = profile.themePreference === 'light' ? 'light' : 'dark';
        setTheme(userTheme);
        localStorage.setItem('attendease_theme_preference', userTheme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(userTheme);
        
        // Scope timetable and records under this user's UID
        const tt = getTimetable(firebaseUser.uid);
        setTimetable(tt);
        initializeDemoHistory(firebaseUser.uid, tt);
        setRecords(getAttendanceRecords(firebaseUser.uid));

        setIsAuthOpen(false);

        // Open profile setup if first time setup is incomplete
        if (!profile.firstTimeSetupCompleted) {
          setIsProfileSetupOpen(true);
        }
      } else {
        setUser(null);
        setRecords([]);
      }
      setAuthLoading(false);
    });

    // Initialize theme based on preference
    const initialTheme = localStorage.getItem('attendease_theme_preference') as 'light' | 'dark' || 'dark';
    setTheme(initialTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initialTheme);

    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('attendease_theme_preference', newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);

    if (user) {
      const updatedProfile = { ...user, themePreference: newTheme };
      setUser(updatedProfile);
      saveUserProfile(updatedProfile);
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
    setRecords(getAttendanceRecords(user.id));
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
    setRecords(getAttendanceRecords(user.id));
  };

  const handlePresentAll = () => {
    if (!user) return;
    const todayObj = new Date();
    const todayStr = todayObj.toISOString().split('T')[0];
    const dayName = todayObj.toLocaleDateString('en-US', { weekday: 'long' });

    markTodayAllPresent(user.id, timetable, todayStr, dayName);
    setRecords(getAttendanceRecords(user.id));
  };

  const handleTimetableParsed = (newTimetable: Timetable) => {
    if (!user) return;
    setTimetable(newTimetable);
    saveTimetable(newTimetable, user.id);
  };

  const handleSaveProfile = (profile: UserProfile) => {
    setUser(profile);
    saveUserProfile(profile);
    setIsProfileSetupOpen(false);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setActiveTab('home');
    } catch (err) {
      console.error('Failed to log out of Firebase', err);
    }
  };

  const handleResetDemoData = () => {
    if (!user) return;
    localStorage.removeItem(`attendease_attendance_records_${user.id}`);
    localStorage.removeItem(`attendease_demo_initialized_${user.id}`);
    initializeDemoHistory(user.id, timetable);
    setRecords(getAttendanceRecords(user.id));
  };

  // Auth Loading Spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center flex-col space-y-4">
        <div className="w-16 h-16 rounded-md bg-primary text-white font-bold flex items-center justify-center text-3xl shadow-md animate-pulse">
          AE
        </div>
        <div className="text-sm font-semibold text-muted">Loading AttendEase...</div>
      </div>
    );
  }

  // Public Landing Page & Auth Gate
  if (!user) {
    return (
      <>
        <LandingPage
          onGetStarted={() => setIsAuthOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink transition-colors duration-200 antialiased selection:bg-brand-pink selection:text-white">
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
        {activeTab === 'home' && (
          <HomeScreen
            user={user}
            timetable={timetable}
            records={records}
            onMarkAttendance={handleMarkAttendance}
            onPresentAll={handlePresentAll}
            onOpenUploadTimetable={() => setIsUploadTimetableOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardScreen user={user} timetable={timetable} records={records} />
        )}

        {activeTab === 'calendar' && (
          <CalendarScreen
            records={records}
            timetable={timetable}
            onMarkAttendanceOnDate={handleMarkAttendanceOnDate}
          />
        )}

        {activeTab === 'history' && (
          <HistoryScreen
            user={user}
            records={records}
            onOpenDisputeModal={() => setIsDisputeModalOpen(true)}
          />
        )}

        {activeTab === 'settings' && (
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
        user={user}
        timetable={timetable}
        records={records}
      />

      <DisputeClaimModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        user={user}
        timetable={timetable}
        records={records}
      />
    </div>
  );
}
