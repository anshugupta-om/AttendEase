export type Branch = 'AIML' | 'DS' | 'CSE' | 'IT' | 'ECE' | 'MECH' | 'CIVIL';

export type Year = 'Second Year' | 'Third Year' | 'Fourth Year';

export type AttendanceStatus = 'Present' | 'Absent' | 'Cancelled' | 'Holiday';

export interface UserProfile {
  id: string;
  firebaseUid?: string;
  name: string;
  email: string;
  branch: Branch;
  year: Year;
  semester: number;
  section: string;
  batch?: string; // e.g. C1, C2
  collegeName: string;
  avatarUrl?: string;
  firstTimeSetupCompleted: boolean;
  themePreference: 'light' | 'dark' | 'system';
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
  section: string;
  roomNumber: string;
  uploadedFileName?: string;
  updatedAt: string;
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
