import { AttendanceRecord, OverallStats, SubjectSummary, Timetable } from '../types';

export function calculateAnalytics(records: AttendanceRecord[], timetable: Timetable, startDate?: string) {
  // Filter records by start date if provided
  const activeRecords = startDate
    ? records.filter(r => r.date >= startDate)
    : records;

  // Collect all unique subjects across weekly schedule using a composite case-insensitive key
  const subjectMap = new Map<string, { code: string; name: string; faculty: string }>();

  const addSubject = (code: string | undefined, name: string | undefined, faculty: string | undefined) => {
    const cleanCode = (code || '').trim();
    const cleanName = (name || '').trim();
    const cleanFaculty = (faculty || '').trim();
    const key = (cleanCode || cleanName).toUpperCase();
    if (!key) return;

    if (!subjectMap.has(key)) {
      subjectMap.set(key, {
        code: cleanCode,
        name: cleanName,
        faculty: cleanFaculty || 'Unknown / Removed'
      });
    }
  };

  Object.values(timetable.weeklySchedule).forEach(daySlots => {
    daySlots.forEach(slot => {
      addSubject(slot.subjectCode, slot.subjectName, slot.facultyName);
    });
  });

  // Also scan active attendance records to include subjects that may have been soft-deleted from the schedule
  activeRecords.forEach(r => {
    addSubject(r.subjectCode, r.subjectName, 'Unknown / Removed');
  });

  const subjectSummaries: SubjectSummary[] = [];
  let totalLectures = 0;
  let totalAttended = 0;
  let totalMissed = 0;

  subjectMap.forEach((subInfo, key) => {
    const subRecords = activeRecords.filter(r => {
      const rKey = ((r.subjectCode || '').trim() || (r.subjectName || '').trim()).toUpperCase();
      return rKey === key && r.status !== 'Cancelled';
    });
    const total = subRecords.length;
    const attended = subRecords.filter(r => r.status === 'Present').length;
    const missed = subRecords.filter(r => r.status === 'Absent').length;
    const percentage = total > 0 ? Math.round((attended / total) * 100) : 100;

    totalLectures += total;
    totalAttended += attended;
    totalMissed += missed;

    let statusColor: 'green' | 'yellow' | 'red' = 'green';
    if (percentage < 60) {
      statusColor = 'red';
    } else if (percentage < 75) {
      statusColor = 'yellow';
    }

    // Calculate lectures needed to reach 75%:
    // (attended + x) / (total + x) >= 0.75 => x >= (0.75*total - attended) / 0.25
    let needed = 0;
    if (percentage < 75) {
      needed = Math.ceil((0.75 * total - attended) / 0.25);
      if (needed < 0) needed = 0;
    }

    subjectSummaries.push({
      subjectCode: subInfo.code,
      subjectName: subInfo.name,
      facultyName: subInfo.faculty,
      totalLectures: total,
      attended,
      missed,
      percentage,
      statusColor,
      lecturesNeededFor75: needed
    });
  });

  const overallPercentage = totalLectures > 0 ? Math.round((totalAttended / totalLectures) * 100) : 100;

  // Calculate Today's %
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecords = activeRecords.filter(r => r.date === todayStr && r.status !== 'Cancelled');
  const todayAttended = todayRecords.filter(r => r.status === 'Present').length;
  const todayPercentage = todayRecords.length > 0 ? Math.round((todayAttended / todayRecords.length) * 100) : 100;

  // Calculate Weekly % (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weeklyRecords = activeRecords.filter(r => new Date(r.date) >= sevenDaysAgo && r.status !== 'Cancelled');
  const weeklyAttended = weeklyRecords.filter(r => r.status === 'Present').length;
  const weeklyPercentage = weeklyRecords.length > 0 ? Math.round((weeklyAttended / weeklyRecords.length) * 100) : 100;

  // Calculate Monthly % (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const monthlyRecords = activeRecords.filter(r => new Date(r.date) >= thirtyDaysAgo && r.status !== 'Cancelled');
  const monthlyAttended = monthlyRecords.filter(r => r.status === 'Present').length;
  const monthlyPercentage = monthlyRecords.length > 0 ? Math.round((monthlyAttended / monthlyRecords.length) * 100) : 100;

  const stats: OverallStats = {
    overallPercentage,
    totalLectures,
    totalAttended,
    totalMissed,
    todayPercentage,
    weeklyPercentage,
    monthlyPercentage
  };

  return {
    subjectSummaries,
    stats
  };
}
