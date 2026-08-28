export type Branch = 'AIML' | 'DS' | 'CSE' | 'IT' | 'ECE' | 'MECH' | 'CIVIL';

export type Year = 'Second Year' | 'Third Year' | 'Fourth Year';

export const SECTIONS = ['A', 'B', 'C', 'D'] as const;
export type Section = typeof SECTIONS[number];

export type AttendanceStatus = 'Present' | 'Absent' | 'Cancelled' | 'Holiday';

export interface UserProfile {
  id: string;
  firebaseUid?: string;
  name: string;
  email: string;
  branch: Branch;
  year: Year;
  semester: number;
  section: Section;
  batch?: string; // e.g. C1, C2
  collegeName: string;
  avatarUrl?: string;
  firstTimeSetupCompleted: boolean;
  themePreference: 'light' | 'dark' | 'system';
  analyticsStartDate?: string; // YYYY-MM-DD
}

export interface LectureSlot {
  id: string;
  lectureNumber: number; // 1, 2, 3...
  subjectCode: string;   // e.g. "CS301" or "AI402"
  subjectName: string;   // e.g. "Machine Learning"
  facultyName: string;   // e.g. "Dr. A. Sharma"
  roomNumber: string;    // e.g. "Lab 3" or "LH-102"
  startTime: string;     // e.g. "09:00 AM"
  endTime: string;       // e.g. "10:00 AM"
  isLab?: boolean;
  batchSection?: string; // e.g. "C1" or "All"
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
}

export interface Timetable {
  id: string;
  branch: Branch;
  year: Year;
  semester: number;
  section: Section;
  roomNumber: string;
  uploadedFileName?: string;
  updatedAt: string;
  isSharedTemplate?: boolean;
  sourceType?: 'ai-parsed' | 'manual' | 'shared';
  weeklySchedule: {
    Monday: LectureSlot[];
    Tuesday: LectureSlot[];
    Wednesday: LectureSlot[];
    Thursday: LectureSlot[];
    Friday: LectureSlot[];
    Saturday: LectureSlot[];
  };
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  lectureId: string;
  subjectCode: string;
  subjectName: string;
  status: AttendanceStatus;
  timestamp: string; // ISO string
  note?: string;
}

export interface SubjectSummary {
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  totalLectures: number;
  attended: number;
  missed: number;
  percentage: number;
  statusColor: 'green' | 'yellow' | 'red';
  lecturesNeededFor75: number;
}

export interface OverallStats {
  overallPercentage: number;
  totalLectures: number;
  totalAttended: number;
  totalMissed: number;
  todayPercentage: number;
  weeklyPercentage: number;
  monthlyPercentage: number;
}

export interface LectureOverride {
  subjectName?: string;
  subjectCode?: string;
  facultyName?: string;
  startTime?: string;
  endTime?: string;
  roomNumber?: string;
  isLab?: boolean;
  batchSection?: string;
  editedAt: string; // ISO timestamp
}

export interface AddedLectureSlot extends Omit<LectureSlot, 'id' | 'lectureNumber'> {
  id: string; // generated UUID
  origin: 'user-added';
  createdAt: string; // ISO
}

export interface UserTimetableOverrides {
  baseTemplateId: string; // e.g. "AIML_Second_Year_Sem3_SecA"
  overrides: Record<string, LectureOverride>; // keyed by lectureId
  addedLectures?: Record<string, AddedLectureSlot>; // new user added lectures, keyed by lectureId
  removedLectureIds?: Record<string, { removedAt: string }>; // lectureIds that were deleted, keyed by lectureId
}
