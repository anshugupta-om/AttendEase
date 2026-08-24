import { AttendanceRecord, OverallStats, SubjectSummary, Timetable } from '../types';

export function calculateAnalytics(records: AttendanceRecord[], timetable: Timetable) {
  // Collect all unique subjects across weekly schedule
  const subjectMap = new Map<string, { code: string; name: string; faculty: string }>();

  Object.values(timetable.weeklySchedule).forEach(daySlots => {
    daySlots.forEach(slot => {
      if (!subjectMap.has(slot.subjectCode)) {
        subjectMap.set(slot.subjectCode, {
          code: slot.subjectCode,
          name: slot.subjectName,
          faculty: slot.facultyName
        });
      }
    });
  });

  const subjectSummaries: SubjectSummary[] = [];
  let totalLectures = 0;
  let totalAttended = 0;
  let totalMissed = 0;

  subjectMap.forEach((subInfo, code) => {
    const subRecords = records.filter(r => r.subjectCode === code && r.status !== 'Cancelled');
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
      subjectCode: code,
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
  const todayRecords = records.filter(r => r.date === todayStr && r.status !== 'Cancelled');
  const todayAttended = todayRecords.filter(r => r.status === 'Present').length;
  const todayPercentage = todayRecords.length > 0 ? Math.round((todayAttended / todayRecords.length) * 100) : 100;

  // Calculate Weekly % (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weeklyRecords = records.filter(r => new Date(r.date) >= sevenDaysAgo && r.status !== 'Cancelled');
  const weeklyAttended = weeklyRecords.filter(r => r.status === 'Present').length;
  const weeklyPercentage = weeklyRecords.length > 0 ? Math.round((weeklyAttended / weeklyRecords.length) * 100) : 100;

  // Calculate Monthly % (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const monthlyRecords = records.filter(r => new Date(r.date) >= thirtyDaysAgo && r.status !== 'Cancelled');
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
