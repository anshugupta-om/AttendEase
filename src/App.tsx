/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { AttendanceRecord, AttendanceStatus, LectureOverride, Timetable, UserProfile, UserTimetableOverrides } from './types';
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
  applyOverridesToTimetable,
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

  // Per-user lecture overrides (stored in Firestore)
  const [overrides, setOverrides] = useState<UserTimetableOverrides | null>(null);

  // Effective timetable = base timetable merged with personal overrides
  const effectiveTimetable = useMemo(
    () => applyOverridesToTimetable(timetable, overrides),
    [timetable, overrides]
  );

  // Initialize and listen to Firebase auth state changes on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
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

        // Load lecture overrides from Firestore
        try {
          const overridesRes = await fetch(`/api/lecture-overrides?uid=${encodeURIComponent(firebaseUser.uid)}`);
          const overridesData = await overridesRes.json();
          if (overridesData.success && overridesData.data) {
            setOverrides(overridesData.data);
          } else {
            setOverrides(null);
          }
        } catch (err) {
          console.error('[Overrides] Failed to load lecture overrides:', err);
          setOverrides(null);
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

  const handleSaveProfile = async (profile: UserProfile) => {
    const configChanged = !user || 
      user.branch !== profile.branch ||
      user.year !== profile.year ||
      user.semester !== profile.semester ||
      user.section !== profile.section;

    setUser(profile);
    saveUserProfile(profile);
    setIsProfileSetupOpen(false);

    if (configChanged) {
      try {
        console.log(`[Config Change] Academic configuration changed. Checking for shared timetable template...`);
        const response = await fetch(`/api/timetable-template?branch=${encodeURIComponent(profile.branch)}&year=${encodeURIComponent(profile.year)}&semester=${encodeURIComponent(profile.semester)}&section=${encodeURIComponent(profile.section)}`);
        const data = await response.json();
        if (data.success && data.found && data.template?.weeklySchedule) {
          console.log(`[Config Change] Shared template found. Auto-applying timetable for configuration:`, {
            branch: profile.branch,
            year: profile.year,
            semester: profile.semester,
            section: profile.section
          });
          const timetable: Timetable = {
            id: `tt_shared_${Date.now()}`,
            branch: data.template.branch,
            year: data.template.year,
            semester: data.template.semester,
            section: data.template.section,
            roomNumber: data.template.roomNumber,
            updatedAt: data.template.updatedAt || new Date().toISOString(),
            weeklySchedule: data.template.weeklySchedule,
            isSharedTemplate: true,
            sourceType: 'shared'
          };
          setTimetable(timetable);
          saveTimetable(timetable, profile.id);
        } else {
          console.log(`[Config Change] No shared template found for configuration. Resetting active timetable to empty.`);
          const emptyTimetable: Timetable = {
            id: `tt_empty_${Date.now()}`,
            branch: profile.branch,
            year: profile.year,
            semester: profile.semester,
            section: profile.section,
            roomNumber: 'TBD',
            updatedAt: new Date().toISOString(),
            weeklySchedule: {
              Monday: [],
              Tuesday: [],
              Wednesday: [],
              Thursday: [],
              Friday: [],
              Saturday: []
            }
          };
          setTimetable(emptyTimetable);
          saveTimetable(emptyTimetable, profile.id);
          setIsUploadTimetableOpen(true);
        }
      } catch (err) {
        console.error('[Config Change] Failed to fetch shared template on configuration update:', err);
      }

      // Clear overrides when academic config changes (old overrides don't apply to new template)
      try {
        await fetch('/api/lecture-overrides', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: profile.id, clearAll: true })
        });
        setOverrides(null);
        console.log('[Config Change] Cleared lecture overrides for previous configuration.');
      } catch (err) {
        console.error('[Config Change] Failed to clear overrides:', err);
      }
    }
  };

  // Handle editing a lecture (personal override) — saves to Firestore
  const handleEditLecture = async (lectureId: string, _dayOfWeek: string, override: LectureOverride) => {
    if (!user) return;
    const baseTemplateId = `${user.branch}_${user.year}_Sem${user.semester}_Sec${user.section}`;

    try {
      const response = await fetch('/api/lecture-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.id, baseTemplateId, lectureId, override, action: 'edit' })
      });
      if (!response.ok) throw new Error(`HTTP status ${response.status}`);
      const resData = await response.json();
      if (!resData.success) throw new Error(resData.error || 'Server error');

      // Update local state immediately
      setOverrides(prev => ({
        baseTemplateId,
        overrides: {
          ...(prev?.overrides || {}),
          [lectureId]: override
        },
        addedLectures: prev?.addedLectures,
        removedLectureIds: prev?.removedLectureIds
      }));
      console.log(`[Overrides] Saved edit for lecture ${lectureId}`);
    } catch (err) {
      console.error('[Overrides] Failed to save lecture edit:', err);
      alert('Failed to save lecture edit. Please check your connection.');
    }
  };

  // Handle adding a new personal lecture
  const handleAddLecture = async (lectureId: string, dayOfWeek: string, newLecture: any) => {
    if (!user) return;
    const baseTemplateId = `${user.branch}_${user.year}_Sem${user.semester}_Sec${user.section}`;
    const addedSlot = {
      ...newLecture,
      id: lectureId,
      dayOfWeek,
      origin: 'user-added',
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/lecture-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.id, baseTemplateId, lectureId, override: addedSlot, action: 'add' })
      });
      if (!response.ok) throw new Error(`HTTP status ${response.status}`);
      const resData = await response.json();
      if (!resData.success) throw new Error(resData.error || 'Server error');

      setOverrides(prev => ({
        baseTemplateId,
        overrides: prev?.overrides || {},
        addedLectures: {
          ...(prev?.addedLectures || {}),
          [lectureId]: addedSlot
        },
        removedLectureIds: prev?.removedLectureIds || {}
      }));
    } catch (err) {
      console.error('[Overrides] Failed to save added lecture:', err);
      alert('Failed to add lecture. Please check your connection.');
    }
  };

  // Handle deleting a lecture (either soft-deleting a template one, or hard-deleting a user-added one)
  const handleRemoveLecture = async (lectureId: string, isUserAdded: boolean) => {
    if (!user) return;
    const baseTemplateId = `${user.branch}_${user.year}_Sem${user.semester}_Sec${user.section}`;

    try {
      if (isUserAdded) {
        // hard delete via the DELETE endpoint using `action: 'delete_added'`
        const response = await fetch('/api/lecture-overrides', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.id, lectureId, action: 'delete_added' })
        });
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        const resData = await response.json();
        if (!resData.success) throw new Error(resData.error || 'Server error');
        
        setOverrides(prev => {
          if (!prev) return null;
          const newAdded = { ...prev.addedLectures };
          delete newAdded[lectureId];
          return { ...prev, addedLectures: newAdded };
        });
      } else {
        // soft delete via POST endpoint using `action: 'remove'`
        const response = await fetch('/api/lecture-overrides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.id, baseTemplateId, lectureId, action: 'remove' })
        });
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        const resData = await response.json();
        if (!resData.success) throw new Error(resData.error || 'Server error');

        setOverrides(prev => ({
          baseTemplateId,
          overrides: prev?.overrides || {},
          addedLectures: prev?.addedLectures || {},
          removedLectureIds: {
            ...(prev?.removedLectureIds || {}),
            [lectureId]: { removedAt: new Date().toISOString() }
          }
        }));
      }
    } catch (err) {
      console.error('[Overrides] Failed to remove lecture:', err);
      alert('Failed to remove lecture. Please check your connection.');
    }
  };

  const handleRestoreLecture = async (lectureId: string) => {
    if (!user) return;
    const baseTemplateId = `${user.branch}_${user.year}_Sem${user.semester}_Sec${user.section}`;
    
    try {
      const response = await fetch('/api/lecture-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.id, baseTemplateId, lectureId, action: 'restore' })
      });
      if (!response.ok) throw new Error(`HTTP status ${response.status}`);
      const resData = await response.json();
      if (!resData.success) throw new Error(resData.error || 'Server error');

      setOverrides(prev => {
        if (!prev) return null;
        const newRemoved = { ...prev.removedLectureIds };
        delete newRemoved[lectureId];
        return { ...prev, removedLectureIds: newRemoved };
      });
    } catch (err) {
      console.error('[Overrides] Failed to restore lecture:', err);
      alert('Failed to restore lecture. Please check your connection.');
    }
  };

  // Handle reverting a lecture override — deletes from Firestore
  const handleRevertLecture = async (lectureId: string) => {
    if (!user) return;

    try {
      const response = await fetch('/api/lecture-overrides', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.id, lectureId })
      });
      if (!response.ok) throw new Error(`HTTP status ${response.status}`);
      const resData = await response.json();
      if (!resData.success) throw new Error(resData.error || 'Server error');

      // Update local state immediately
      setOverrides(prev => {
        if (!prev) return null;
        const newOverrides = { ...prev.overrides };
        delete newOverrides[lectureId];
        return { ...prev, overrides: newOverrides };
      });
      console.log(`[Overrides] Reverted lecture ${lectureId} to shared template`);
    } catch (err) {
      console.error('[Overrides] Failed to revert lecture override:', err);
      alert('Failed to revert lecture override. Please check your connection.');
    }
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

  const handleUpdateStartDate = (date: string | null) => {
    if (!user) return;
    const updatedProfile = {
      ...user,
      analyticsStartDate: date || undefined
    };
    setUser(updatedProfile);
    saveUserProfile(updatedProfile);
    console.log(`[Analytics] Updated analytics start date to: ${date}`);
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
            timetable={effectiveTimetable}
            records={records}
            overrides={overrides}
            onMarkAttendance={handleMarkAttendance}
            onPresentAll={handlePresentAll}
            onOpenUploadTimetable={() => setIsUploadTimetableOpen(true)}
            onEditLecture={handleEditLecture}
            onRevertLecture={handleRevertLecture}
            onAddLecture={handleAddLecture}
            onRemoveLecture={handleRemoveLecture}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardScreen
            user={user}
            timetable={effectiveTimetable}
            records={records}
            onUpdateStartDate={handleUpdateStartDate}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarScreen
            records={records}
            timetable={effectiveTimetable}
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
            timetable={timetable}
            overrides={overrides}
            onToggleTheme={toggleTheme}
            onOpenEditProfile={() => setIsProfileSetupOpen(true)}
            onOpenUploadTimetable={() => setIsUploadTimetableOpen(true)}
            onResetData={handleResetDemoData}
            onLogout={handleLogout}
            onRestoreLecture={handleRestoreLecture}
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
        user={user}
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
