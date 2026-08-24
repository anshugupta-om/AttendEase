import { Timetable } from '../types';

export const SAMPLE_TIMETABLES: Record<string, Timetable> = {
  'AIML-3-A': {
    id: 'tt-aiml-sem3',
    branch: 'AIML',
    year: 'Second Year',
    semester: 3,
    section: 'A',
    roomNumber: 'LH-302',
    uploadedFileName: 'Official_AIML_Sem3_SecA_Timetable.pdf',
    updatedAt: new Date().toISOString(),
    weeklySchedule: {
      Monday: [
        {
          id: 'mon-1',
          lectureNumber: 1,
          subjectCode: 'AI301',
          subjectName: 'Artificial Intelligence Fundamentals',
          facultyName: 'Dr. Ramesh Verma',
          roomNumber: 'LH-302',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          dayOfWeek: 'Monday'
        },
        {
          id: 'mon-2',
          lectureNumber: 2,
          subjectCode: 'CS302',
          subjectName: 'Data Structures & Algorithms',
          facultyName: 'Prof. Ananya Sen',
          roomNumber: 'LH-302',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          dayOfWeek: 'Monday'
        },
        {
          id: 'mon-3',
          lectureNumber: 3,
          subjectCode: 'MA301',
          subjectName: 'Discrete Mathematics & Probability',
          facultyName: 'Dr. S. K. Gupta',
          roomNumber: 'LH-302',
          startTime: '11:15 AM',
          endTime: '12:15 PM',
          dayOfWeek: 'Monday'
        },
        {
          id: 'mon-4',
          lectureNumber: 4,
          subjectCode: 'AI305L',
          subjectName: 'Python for AI Lab (Batch C1)',
          facultyName: 'Prof. Ananya Sen / Dr. R. Verma',
          roomNumber: 'AI Lab 2',
          startTime: '01:15 PM',
          endTime: '03:15 PM',
          isLab: true,
          batchSection: 'C1',
          dayOfWeek: 'Monday'
        },
        {
          id: 'mon-5',
          lectureNumber: 5,
          subjectCode: 'HU301',
          subjectName: 'Universal Human Values',
          facultyName: 'Dr. Meenakshi Sundaram',
          roomNumber: 'LH-302',
          startTime: '03:30 PM',
          endTime: '04:30 PM',
          dayOfWeek: 'Monday'
        }
      ],
      Tuesday: [
        {
          id: 'tue-1',
          lectureNumber: 1,
          subjectCode: 'CS303',
          subjectName: 'Database Management Systems',
          facultyName: 'Prof. Rajesh Kulkarni',
          roomNumber: 'LH-302',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          dayOfWeek: 'Tuesday'
        },
        {
          id: 'tue-2',
          lectureNumber: 2,
          subjectCode: 'AI301',
          subjectName: 'Artificial Intelligence Fundamentals',
          facultyName: 'Dr. Ramesh Verma',
          roomNumber: 'LH-302',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          dayOfWeek: 'Tuesday'
        },
        {
          id: 'tue-3',
          lectureNumber: 3,
          subjectCode: 'CS302',
          subjectName: 'Data Structures & Algorithms',
          facultyName: 'Prof. Ananya Sen',
          roomNumber: 'LH-302',
          startTime: '11:15 AM',
          endTime: '12:15 PM',
          dayOfWeek: 'Tuesday'
        },
        {
          id: 'tue-4',
          lectureNumber: 4,
          subjectCode: 'CS303L',
          subjectName: 'DBMS Lab (Batch C2)',
          facultyName: 'Prof. Rajesh Kulkarni',
          roomNumber: 'Database Lab 1',
          startTime: '01:15 PM',
          endTime: '03:15 PM',
          isLab: true,
          batchSection: 'C2',
          dayOfWeek: 'Tuesday'
        },
        {
          id: 'tue-5',
          lectureNumber: 5,
          subjectCode: 'MA301',
          subjectName: 'Discrete Mathematics & Probability',
          facultyName: 'Dr. S. K. Gupta',
          roomNumber: 'LH-302',
          startTime: '03:30 PM',
          endTime: '04:30 PM',
          dayOfWeek: 'Tuesday'
        }
      ],
      Wednesday: [
        {
          id: 'wed-1',
          lectureNumber: 1,
          subjectCode: 'AI302',
          subjectName: 'Linear Algebra for Machine Learning',
          facultyName: 'Dr. Priya Sharma',
          roomNumber: 'LH-302',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          dayOfWeek: 'Wednesday'
        },
        {
          id: 'wed-2',
          lectureNumber: 2,
          subjectCode: 'CS303',
          subjectName: 'Database Management Systems',
          facultyName: 'Prof. Rajesh Kulkarni',
          roomNumber: 'LH-302',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          dayOfWeek: 'Wednesday'
        },
        {
          id: 'wed-3',
          lectureNumber: 3,
          subjectCode: 'AI301',
          subjectName: 'Artificial Intelligence Fundamentals',
          facultyName: 'Dr. Ramesh Verma',
          roomNumber: 'LH-302',
          startTime: '11:15 AM',
          endTime: '12:15 PM',
          dayOfWeek: 'Wednesday'
        },
        {
          id: 'wed-4',
          lectureNumber: 4,
          subjectCode: 'CS302L',
          subjectName: 'Data Structures Lab (Batch C1)',
          facultyName: 'Prof. Ananya Sen',
          roomNumber: 'Software Lab 3',
          startTime: '01:15 PM',
          endTime: '03:15 PM',
          isLab: true,
          batchSection: 'C1',
          dayOfWeek: 'Wednesday'
        }
      ],
      Thursday: [
        {
          id: 'thu-1',
          lectureNumber: 1,
          subjectCode: 'CS302',
          subjectName: 'Data Structures & Algorithms',
          facultyName: 'Prof. Ananya Sen',
          roomNumber: 'LH-302',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          dayOfWeek: 'Thursday'
        },
        {
          id: 'thu-2',
          lectureNumber: 2,
          subjectCode: 'AI302',
          subjectName: 'Linear Algebra for Machine Learning',
          facultyName: 'Dr. Priya Sharma',
          roomNumber: 'LH-302',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          dayOfWeek: 'Thursday'
        },
        {
          id: 'thu-3',
          lectureNumber: 3,
          subjectCode: 'CS303',
          subjectName: 'Database Management Systems',
          facultyName: 'Prof. Rajesh Kulkarni',
          roomNumber: 'LH-302',
          startTime: '11:15 AM',
          endTime: '12:15 PM',
          dayOfWeek: 'Thursday'
        },
        {
          id: 'thu-4',
          lectureNumber: 4,
          subjectCode: 'HU301',
          subjectName: 'Universal Human Values',
          facultyName: 'Dr. Meenakshi Sundaram',
          roomNumber: 'LH-302',
          startTime: '01:15 PM',
          endTime: '02:15 PM',
          dayOfWeek: 'Thursday'
        },
        {
          id: 'thu-5',
          lectureNumber: 5,
          subjectCode: 'MA301',
          subjectName: 'Discrete Mathematics & Probability',
          facultyName: 'Dr. S. K. Gupta',
          roomNumber: 'LH-302',
          startTime: '02:30 PM',
          endTime: '03:30 PM',
          dayOfWeek: 'Thursday'
        }
      ],
      Friday: [
        {
          id: 'fri-1',
          lectureNumber: 1,
          subjectCode: 'AI302',
          subjectName: 'Linear Algebra for Machine Learning',
          facultyName: 'Dr. Priya Sharma',
          roomNumber: 'LH-302',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          dayOfWeek: 'Friday'
        },
        {
          id: 'fri-2',
          lectureNumber: 2,
          subjectCode: 'AI301',
          subjectName: 'Artificial Intelligence Fundamentals',
          facultyName: 'Dr. Ramesh Verma',
          roomNumber: 'LH-302',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          dayOfWeek: 'Friday'
        },
        {
          id: 'fri-3',
          lectureNumber: 3,
          subjectCode: 'CS303',
          subjectName: 'Database Management Systems',
          facultyName: 'Prof. Rajesh Kulkarni',
          roomNumber: 'LH-302',
          startTime: '11:15 AM',
          endTime: '12:15 PM',
          dayOfWeek: 'Friday'
        },
        {
          id: 'fri-4',
          lectureNumber: 4,
          subjectCode: 'AI306P',
          subjectName: 'AI Mini Project Work',
          facultyName: 'Dr. Ramesh Verma / Dr. Priya Sharma',
          roomNumber: 'AI Innovation Hub',
          startTime: '01:15 PM',
          endTime: '04:15 PM',
          isLab: true,
          dayOfWeek: 'Friday'
        }
      ],
      Saturday: [
        {
          id: 'sat-1',
          lectureNumber: 1,
          subjectCode: 'MA301',
          subjectName: 'Discrete Mathematics & Probability',
          facultyName: 'Dr. S. K. Gupta',
          roomNumber: 'LH-302',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          dayOfWeek: 'Saturday'
        },
        {
          id: 'sat-2',
          lectureNumber: 2,
          subjectCode: 'HU301',
          subjectName: 'Universal Human Values',
          facultyName: 'Dr. Meenakshi Sundaram',
          roomNumber: 'LH-302',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          dayOfWeek: 'Saturday'
        },
        {
          id: 'sat-3',
          lectureNumber: 3,
          subjectCode: 'AI307S',
          subjectName: 'Soft Skills & Tech Aptitude',
          facultyName: 'Prof. Vikram Roy',
          roomNumber: 'Auditorium B',
          startTime: '11:15 AM',
          endTime: '01:15 PM',
          dayOfWeek: 'Saturday'
        }
      ]
    }
  },
  'DS-3-A': {
    id: 'tt-ds-sem3',
    branch: 'DS',
    year: 'Second Year',
    semester: 3,
    section: 'A',
    roomNumber: 'LH-204',
    uploadedFileName: 'Official_DataScience_Sem3_SecA_Timetable.pdf',
    updatedAt: new Date().toISOString(),
    weeklySchedule: {
      Monday: [
        {
          id: 'ds-mon-1',
          lectureNumber: 1,
          subjectCode: 'DS301',
          subjectName: 'Data Analytics & Visualization',
          facultyName: 'Dr. Sunita Mehta',
          roomNumber: 'LH-204',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          dayOfWeek: 'Monday'
        },
        {
          id: 'ds-mon-2',
          lectureNumber: 2,
          subjectCode: 'CS302',
          subjectName: 'Data Structures & Algorithms',
          facultyName: 'Prof. Ananya Sen',
          roomNumber: 'LH-204',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          dayOfWeek: 'Monday'
        },
        {
          id: 'ds-mon-3',
          lectureNumber: 3,
          subjectCode: 'ST301',
          subjectName: 'Applied Statistics for Data Science',
          facultyName: 'Dr. P. V. Raman',
          roomNumber: 'LH-204',
          startTime: '11:15 AM',
          endTime: '12:15 PM',
          dayOfWeek: 'Monday'
        },
        {
          id: 'ds-mon-4',
          lectureNumber: 4,
          subjectCode: 'DS301L',
          subjectName: 'Data Analytics Lab (Batch D1)',
          facultyName: 'Dr. Sunita Mehta',
          roomNumber: 'Data Science Lab',
          startTime: '01:15 PM',
          endTime: '03:15 PM',
          isLab: true,
          batchSection: 'D1',
          dayOfWeek: 'Monday'
        }
      ],
      Tuesday: [
        {
          id: 'ds-tue-1',
          lectureNumber: 1,
          subjectCode: 'CS303',
          subjectName: 'Database Management Systems',
          facultyName: 'Prof. Rajesh Kulkarni',
          roomNumber: 'LH-204',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          dayOfWeek: 'Tuesday'
        },
        {
          id: 'ds-tue-2',
          lectureNumber: 2,
          subjectCode: 'DS301',
          subjectName: 'Data Analytics & Visualization',
          facultyName: 'Dr. Sunita Mehta',
          roomNumber: 'LH-204',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          dayOfWeek: 'Tuesday'
        },
        {
          id: 'ds-tue-3',
          lectureNumber: 3,
          subjectCode: 'ST301',
          subjectName: 'Applied Statistics for Data Science',
          facultyName: 'Dr. P. V. Raman',
          roomNumber: 'LH-204',
          startTime: '11:15 AM',
          endTime: '12:15 PM',
          dayOfWeek: 'Tuesday'
        },
        {
          id: 'ds-tue-4',
          lectureNumber: 4,
          subjectCode: 'CS303L',
          subjectName: 'DBMS Lab (Batch D2)',
          facultyName: 'Prof. Rajesh Kulkarni',
          roomNumber: 'Database Lab 2',
          startTime: '01:15 PM',
          endTime: '03:15 PM',
          isLab: true,
          batchSection: 'D2',
          dayOfWeek: 'Tuesday'
        }
      ],
      Wednesday: [
        {
          id: 'ds-wed-1',
          lectureNumber: 1,
          subjectCode: 'CS302',
          subjectName: 'Data Structures & Algorithms',
          facultyName: 'Prof. Ananya Sen',
          roomNumber: 'LH-204',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          dayOfWeek: 'Wednesday'
        },
        {
          id: 'ds-wed-2',
          lectureNumber: 2,
          subjectCode: 'DS301',
          subjectName: 'Data Analytics & Visualization',
          facultyName: 'Dr. Sunita Mehta',
          roomNumber: 'LH-204',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          dayOfWeek: 'Wednesday'
        },
        {
          id: 'ds-wed-3',
          lectureNumber: 3,
          subjectCode: 'ST301',
          subjectName: 'Applied Statistics for Data Science',
          facultyName: 'Dr. P. V. Raman',
          roomNumber: 'LH-204',
          startTime: '11:15 AM',
          endTime: '12:15 PM',
          dayOfWeek: 'Wednesday'
        }
      ],
      Thursday: [
        {
          id: 'ds-thu-1',
          lectureNumber: 1,
          subjectCode: 'CS303',
          subjectName: 'Database Management Systems',
          facultyName: 'Prof. Rajesh Kulkarni',
          roomNumber: 'LH-204',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          dayOfWeek: 'Thursday'
        },
        {
          id: 'ds-thu-2',
          lectureNumber: 2,
          subjectCode: 'DS302',
          subjectName: 'R & Python Programming for Data Science',
          facultyName: 'Prof. Harsh Varma',
          roomNumber: 'LH-204',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          dayOfWeek: 'Thursday'
        },
        {
          id: 'ds-thu-3',
          lectureNumber: 3,
          subjectCode: 'HU301',
          subjectName: 'Universal Human Values',
          facultyName: 'Dr. Meenakshi Sundaram',
          roomNumber: 'LH-204',
          startTime: '11:15 AM',
          endTime: '12:15 PM',
          dayOfWeek: 'Thursday'
        }
      ],
      Friday: [
        {
          id: 'ds-fri-1',
          lectureNumber: 1,
          subjectCode: 'DS302',
          subjectName: 'R & Python Programming for Data Science',
          facultyName: 'Prof. Harsh Varma',
          roomNumber: 'LH-204',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          dayOfWeek: 'Friday'
        },
        {
          id: 'ds-fri-2',
          lectureNumber: 2,
          subjectCode: 'CS302',
          subjectName: 'Data Structures & Algorithms',
          facultyName: 'Prof. Ananya Sen',
          roomNumber: 'LH-204',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          dayOfWeek: 'Friday'
        },
        {
          id: 'ds-fri-3',
          lectureNumber: 3,
          subjectCode: 'CS303',
          subjectName: 'Database Management Systems',
          facultyName: 'Prof. Rajesh Kulkarni',
          roomNumber: 'LH-204',
          startTime: '11:15 AM',
          endTime: '12:15 PM',
          dayOfWeek: 'Friday'
        }
      ],
      Saturday: [
        {
          id: 'ds-sat-1',
          lectureNumber: 1,
          subjectCode: 'ST301',
          subjectName: 'Applied Statistics for Data Science',
          facultyName: 'Dr. P. V. Raman',
          roomNumber: 'LH-204',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          dayOfWeek: 'Saturday'
        },
        {
          id: 'ds-sat-2',
          lectureNumber: 2,
          subjectCode: 'HU301',
          subjectName: 'Universal Human Values',
          facultyName: 'Dr. Meenakshi Sundaram',
          roomNumber: 'LH-204',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          dayOfWeek: 'Saturday'
        }
      ]
    }
  }
};

export const DEFAULT_SUBJECTS = [
  { code: 'AI301', name: 'Artificial Intelligence Fundamentals', faculty: 'Dr. Ramesh Verma' },
  { code: 'CS302', name: 'Data Structures & Algorithms', faculty: 'Prof. Ananya Sen' },
  { code: 'CS303', name: 'Database Management Systems', faculty: 'Prof. Rajesh Kulkarni' },
  { code: 'MA301', name: 'Discrete Mathematics & Probability', faculty: 'Dr. S. K. Gupta' },
  { code: 'AI302', name: 'Linear Algebra for Machine Learning', faculty: 'Dr. Priya Sharma' },
  { code: 'HU301', name: 'Universal Human Values', faculty: 'Dr. Meenakshi Sundaram' },
  { code: 'AI305L', name: 'Python for AI Lab', faculty: 'Prof. Ananya Sen' }
];
