import { AttendanceRecord, AttendanceStatus, Timetable, UserProfile } from '../types';
import { SAMPLE_TIMETABLES } from '../data/sampleTimetables';

const KEYS = {
  USER_PROFILE: 'attendease_user_profile',
  TIMETABLE: 'attendease_current_timetable',
  ATTENDANCE_RECORDS: 'attendease_attendance_records',
  THEME: 'attendease_theme_preference',
  DEMO_INITIALIZED: 'attendease_demo_initialized'
};

export const defaultUser: UserProfile = {
  id: 'usr_default_01',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@student.edu',
  branch: 'AIML',
  year: 'Second Year',
  semester: 3,
  section: 'A',
  batch: 'C1',
  collegeName: 'National Institute of Technology',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  firstTimeSetupCompleted: true,
  themePreference: 'light'
};

export function getUserProfile(userId?: string): UserProfile | null {
  try {
    const key = userId ? `${KEYS.USER_PROFILE}_${userId}` : KEYS.USER_PROFILE;
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse user profile', err);
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  // Store both as the active session profile and user-specific partitioned profile
  localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  localStorage.setItem(`${KEYS.USER_PROFILE}_${profile.id}`, JSON.stringify(profile));
}

export function getTimetable(userId?: string): Timetable {
  try {
    const key = userId ? `${KEYS.TIMETABLE}_${userId}` : KEYS.TIMETABLE;
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to get stored timetable', err);
  }
  // Return default sample timetable for AIML-3-A
  return SAMPLE_TIMETABLES['AIML-3-A'];
}

export function saveTimetable(timetable: Timetable, userId?: string): void {
  const key = userId ? `${KEYS.TIMETABLE}_${userId}` : KEYS.TIMETABLE;
  localStorage.setItem(key, JSON.stringify(timetable));
}

export function getAttendanceRecords(userId?: string): AttendanceRecord[] {
  try {
    const key = userId ? `${KEYS.ATTENDANCE_RECORDS}_${userId}` : KEYS.ATTENDANCE_RECORDS;
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to parse attendance records', err);
  }
  return [];
}

export function saveAttendanceRecords(records: AttendanceRecord[], userId?: string): void {
  const key = userId ? `${KEYS.ATTENDANCE_RECORDS}_${userId}` : KEYS.ATTENDANCE_RECORDS;
  localStorage.setItem(key, JSON.stringify(records));
}

export function recordAttendance(
  userId: string,
  dateStr: string,
  lectureId: string,
  subjectCode: string,
  subjectName: string,
  status: AttendanceStatus,
  note?: string
): AttendanceRecord {
  const records = getAttendanceRecords(userId);
  const existingIdx = records.findIndex(
    r => r.date === dateStr && (r.lectureId === lectureId || (r.subjectCode === subjectCode && r.timestamp.startsWith(dateStr)))
  );

  const newRecord: AttendanceRecord = {
    id: existingIdx >= 0 ? records[existingIdx].id : `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    date: dateStr,
    lectureId,
    subjectCode,
    subjectName,
    status,
    timestamp: new Date().toISOString(),
    note
  };

  if (existingIdx >= 0) {
    records[existingIdx] = newRecord;
  } else {
    records.push(newRecord);
  }

  saveAttendanceRecords(records, userId);
  return newRecord;
}

export function markTodayAllPresent(userId: string, timetable: Timetable, todayDateStr: string, dayOfWeekStr: string): AttendanceRecord[] {
  const schedule = timetable.weeklySchedule[dayOfWeekStr as keyof typeof timetable.weeklySchedule] || [];
  const updated: AttendanceRecord[] = [];

  for (const slot of schedule) {
    const rec = recordAttendance(
      userId,
      todayDateStr,
      slot.id,
      slot.subjectCode,
      slot.subjectName,
      'Present'
    );
    updated.push(rec);
  }

  return updated;
}

// Generate rich realistic past attendance records for demo/testing
export function initializeDemoHistory(userId: string, timetable: Timetable) {
  const initializedKey = `${KEYS.DEMO_INITIALIZED}_${userId}`;
  if (localStorage.getItem(initializedKey)) return;

  const records: AttendanceRecord[] = [];
  const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();

  // Generate 4 weeks of history
  for (let i = 28; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayName = daysMap[d.getDay()];
    const dateStr = d.toISOString().split('T')[0];

    if (dayName === 'Sunday') continue; // No classes on Sunday

    const slots = timetable.weeklySchedule[dayName as keyof typeof timetable.weeklySchedule] || [];
    slots.forEach((slot, idx) => {
      // Simulate 85% attendance rate with occasional absence or cancelled class
      const rand = Math.random();
      let status: AttendanceStatus = 'Present';
      if (rand > 0.88) {
        status = 'Absent';
      } else if (rand > 0.82) {
        status = 'Cancelled';
      }

      records.push({
        id: `demo_${dateStr}_${slot.id}`,
        userId,
        date: dateStr,
        lectureId: slot.id,
        subjectCode: slot.subjectCode,
        subjectName: slot.subjectName,
        status,
        timestamp: new Date(d.getTime() + (9 + idx) * 3600000).toISOString(),
        note: status === 'Absent' ? 'Medical leave / Traffic delay' : undefined
      });
    });
  }

  saveAttendanceRecords(records, userId);
  localStorage.setItem(initializedKey, 'true');
}

export function clearAllData(userId?: string): void {
  if (userId) {
    localStorage.removeItem(`${KEYS.USER_PROFILE}_${userId}`);
    localStorage.removeItem(`${KEYS.TIMETABLE}_${userId}`);
    localStorage.removeItem(`${KEYS.ATTENDANCE_RECORDS}_${userId}`);
    localStorage.removeItem(`${KEYS.DEMO_INITIALIZED}_${userId}`);
    // Also clear generic values if they belong to this user
    try {
      const active = getUserProfile();
      if (active && active.id === userId) {
        localStorage.removeItem(KEYS.USER_PROFILE);
        localStorage.removeItem(KEYS.TIMETABLE);
        localStorage.removeItem(KEYS.ATTENDANCE_RECORDS);
      }
    } catch (_) {}
  } else {
    localStorage.removeItem(KEYS.USER_PROFILE);
    localStorage.removeItem(KEYS.TIMETABLE);
    localStorage.removeItem(KEYS.ATTENDANCE_RECORDS);
    localStorage.removeItem(KEYS.DEMO_INITIALIZED);
  }
}
