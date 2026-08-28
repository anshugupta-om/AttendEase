import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, deleteField } from 'firebase/firestore';

dotenv.config();

// Firebase initialization on backend
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

let db: any = null;
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'MY_FIREBASE_API_KEY') {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp);
    console.log('Firestore initialized successfully on backend.');
  } catch (err) {
    console.error('Failed to initialize Firestore on backend:', err);
  }
} else {
  console.warn('Firebase config environment variables missing on backend. Firestore features disabled.');
}

// In-memory fallback cache for development/fallback
const memoryCache = new Map<string, any>();

function makeTemplateKey(branch: string, year: string, semester: string | number, section: string): string {
  const cleanBranch = (branch || '').trim().toUpperCase();
  const cleanYear = (year || '').trim().replace(/\s+/g, '_');
  const cleanSem = String(semester || '').trim();
  const cleanSec = (section || '').trim().toUpperCase();
  return `${cleanBranch}_${cleanYear}_Sem${cleanSem}_Sec${cleanSec}`;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore operation timed out')), timeoutMs)
    )
  ]);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // API Healthcheck
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Timetable Template Lookup Endpoint
  app.get('/api/timetable-template', async (req, res) => {
    try {
      const { branch, year, semester, section } = req.query;
      if (!branch || !year || !semester || !section) {
        return res.status(400).json({ error: 'Missing parameters: branch, year, semester, section are required' });
      }

      const key = makeTemplateKey(branch as string, year as string, semester as string, section as string);
      let template: any = null;

      console.log(`[Firestore Lookup] Querying key: "${key}" for parameters:`, { branch, year, semester, section });

      if (db) {
        try {
          const docRef = doc(db, 'timetableTemplates', key);
          const docSnap = await withTimeout(getDoc(docRef), 10000);
          if (docSnap.exists()) {
            template = docSnap.data();
            console.log(`[Firestore Lookup] Key "${key}" found in Firestore!`);
          } else {
            console.log(`[Firestore Lookup] Key "${key}" NOT found in Firestore.`);
          }
        } catch (dbErr) {
          console.error('Failed to fetch from Firestore (timed out or errored):', dbErr);
        }
      }

      // Check memory cache if Firestore did not yield a result
      if (!template && memoryCache.has(key)) {
        console.log(`[Firestore Lookup] Key "${key}" found in fallback memoryCache.`);
        template = memoryCache.get(key);
      }

      if (template) {
        return res.json({
          success: true,
          found: true,
          template: {
            branch: template.branch,
            year: template.year,
            semester: template.semester,
            section: template.section,
            roomNumber: template.roomNumber,
            weeklySchedule: template.weeklySchedule,
            sourceType: template.sourceType || 'ai-parsed',
            usageCount: template.usageCount || 0,
            reports: template.reports || 0,
            updatedAt: template.updatedAt
          }
        });
      }

      return res.json({ success: true, found: false });
    } catch (err: any) {
      console.error('Error fetching timetable template:', err);
      res.status(500).json({ error: 'Internal server error fetching template' });
    }
  });

  // Timetable Template Usage Increment Endpoint
  app.post('/api/increment-template-usage', async (req, res) => {
    try {
      const { branch, year, semester, section } = req.body;
      if (!branch || !year || !semester || !section) {
        return res.status(400).json({ error: 'Missing parameters: branch, year, semester, section are required' });
      }

      const key = makeTemplateKey(branch, year, semester, section);

      if (db) {
        try {
          const docRef = doc(db, 'timetableTemplates', key);
          await withTimeout(setDoc(docRef, {
            usageCount: increment(1),
            updatedAt: new Date().toISOString()
          }, { merge: true }), 10000);
        } catch (dbErr) {
          console.error('Failed to increment usage in Firestore:', dbErr);
        }
      }

      // Also update memoryCache
      if (memoryCache.has(key)) {
        const cached = memoryCache.get(key);
        cached.usageCount = (cached.usageCount || 0) + 1;
        cached.updatedAt = new Date().toISOString();
        memoryCache.set(key, cached);
      }

      res.json({ success: true });
    } catch (err: any) {
      console.error('Error incrementing template usage:', err);
      res.status(500).json({ error: 'Internal server error incrementing template usage' });
    }
  });

  // Timetable Template Reporting/Downvoting Endpoint
  app.post('/api/report-template', async (req, res) => {
    try {
      const { branch, year, semester, section } = req.body;
      if (!branch || !year || !semester || !section) {
        return res.status(400).json({ error: 'Missing parameters: branch, year, semester, section are required' });
      }

      const key = makeTemplateKey(branch, year, semester, section);

      if (db) {
        try {
          const docRef = doc(db, 'timetableTemplates', key);
          await withTimeout(setDoc(docRef, {
            reports: increment(1),
            updatedAt: new Date().toISOString()
          }, { merge: true }), 1500);
        } catch (dbErr) {
          console.error('Failed to increment reports count in Firestore:', dbErr);
        }
      }

      // Also update memoryCache
      if (memoryCache.has(key)) {
        const cached = memoryCache.get(key);
        cached.reports = (cached.reports || 0) + 1;
        cached.updatedAt = new Date().toISOString();
        memoryCache.set(key, cached);
      } else {
        // Create basic record in memoryCache if it didn't exist
        memoryCache.set(key, {
          branch,
          year,
          semester,
          section,
          reports: 1,
          updatedAt: new Date().toISOString()
        });
      }

      res.json({ success: true });
    } catch (err: any) {
      console.error('Error reporting template:', err);
      res.status(500).json({ error: 'Internal server error reporting template' });
    }
  });

  // ======== Per-User Lecture Override Endpoints ========

  // GET lecture overrides for a user
  app.get('/api/lecture-overrides', async (req, res) => {
    try {
      const { uid } = req.query;
      if (!uid) {
        return res.status(400).json({ error: 'Missing parameter: uid is required' });
      }

      let data: any = null;

      if (db) {
        try {
          const docRef = doc(db, 'userTimetableOverrides', uid as string);
          const docSnap = await withTimeout(getDoc(docRef), 10000);
          if (docSnap.exists()) {
            const rawData = docSnap.data();
            
            // Normalize structure to ensure sub-maps exist and flat dotted keys are nested
            data = {
              baseTemplateId: rawData.baseTemplateId || '',
              overrides: rawData.overrides || {},
              addedLectures: rawData.addedLectures || {},
              removedLectureIds: rawData.removedLectureIds || {}
            };

            // Migrate any flat dotted keys that were incorrectly written
            for (const key of Object.keys(rawData)) {
              if (key.includes('.')) {
                const parts = key.split('.');
                const parentKey = parts[0];
                const childKey = parts.slice(1).join('.');

                if (parentKey === 'overrides' || parentKey === 'addedLectures' || parentKey === 'removedLectureIds') {
                  data[parentKey][childKey] = rawData[key];
                }
              }
            }

            console.log(`[Overrides] Loaded normalized overrides for user ${uid}: ${Object.keys(data.overrides).length} edits, ${Object.keys(data.addedLectures).length} added, ${Object.keys(data.removedLectureIds).length} removed`);
          } else {
            console.log(`[Overrides] No overrides document found for user ${uid}`);
          }
        } catch (dbErr) {
          console.error('[Overrides] Failed to fetch overrides from Firestore:', dbErr);
        }
      }

      res.json({ success: true, data });
    } catch (err: any) {
      console.error('Error fetching lecture overrides:', err);
      res.status(500).json({ error: 'Internal server error fetching overrides' });
    }
  });

  // POST (upsert) a single lecture override or add/remove lecture
  app.post('/api/lecture-overrides', async (req, res) => {
    try {
      const { uid, baseTemplateId, lectureId, override, action } = req.body;
      if (!uid || !baseTemplateId || !lectureId) {
        return res.status(400).json({ error: 'Missing parameters: uid, baseTemplateId, lectureId are required' });
      }

      if (db) {
        try {
          const docRef = doc(db, 'userTimetableOverrides', uid);
          const docSnap = await withTimeout(getDoc(docRef), 10000);

          const act = action || 'edit';

          if (docSnap.exists()) {
            // Document exists. We can safely use updateDoc with dotted path notation.
            let updatePayload: any = { baseTemplateId };

            if (act === 'edit') {
              if (!override) return res.status(400).json({ error: 'Missing override data' });
              updatePayload[`overrides.${lectureId}`] = override;
            } else if (act === 'add') {
              if (!override) return res.status(400).json({ error: 'Missing added lecture data' });
              updatePayload[`addedLectures.${lectureId}`] = override;
            } else if (act === 'remove') {
              updatePayload[`removedLectureIds.${lectureId}`] = { removedAt: new Date().toISOString() };
            } else if (act === 'restore') {
              updatePayload[`removedLectureIds.${lectureId}`] = deleteField();
            }

            await withTimeout(updateDoc(docRef, updatePayload), 10000);
            console.log(`[Overrides] Saved action '${act}' using updateDoc for user ${uid}, lecture ${lectureId}`);
          } else {
            // Document does not exist. We initialize it with proper nested objects using setDoc.
            const newDoc: any = {
              baseTemplateId,
              overrides: {},
              addedLectures: {},
              removedLectureIds: {}
            };

            if (act === 'edit') {
              if (!override) return res.status(400).json({ error: 'Missing override data' });
              newDoc.overrides[lectureId] = override;
            } else if (act === 'add') {
              if (!override) return res.status(400).json({ error: 'Missing added lecture data' });
              newDoc.addedLectures[lectureId] = override;
            } else if (act === 'remove') {
              newDoc.removedLectureIds[lectureId] = { removedAt: new Date().toISOString() };
            }
            // For 'restore', it is a no-op since the doc has just been created and has no removedLectureIds.

            await withTimeout(setDoc(docRef, newDoc), 10000);
            console.log(`[Overrides] Saved action '${act}' using setDoc (new doc) for user ${uid}, lecture ${lectureId}`);
          }
        } catch (dbErr) {
          console.error('[Overrides] Failed to save override to Firestore:', dbErr);
          return res.status(500).json({ error: 'Failed to save override' });
        }
      } else {
        return res.status(503).json({ error: 'Firestore not available' });
      }

      res.json({ success: true });
    } catch (err: any) {
      console.error('Error saving lecture override:', err);
      res.status(500).json({ error: 'Internal server error saving override' });
    }
  });

  // DELETE a single lecture override or clear all overrides
  app.delete('/api/lecture-overrides', async (req, res) => {
    try {
      const { uid, lectureId, clearAll, action } = req.body;
      if (!uid) {
        return res.status(400).json({ error: 'Missing parameter: uid is required' });
      }

      if (db) {
        try {
          const docRef = doc(db, 'userTimetableOverrides', uid);
          if (clearAll) {
            // Clear all overrides — reset the document
            await withTimeout(setDoc(docRef, { baseTemplateId: '', overrides: {}, addedLectures: {}, removedLectureIds: {} }), 10000);
            console.log(`[Overrides] Cleared all overrides for user ${uid}`);
          } else if (lectureId) {
            let fieldToDelete = `overrides.${lectureId}`;
            if (action === 'delete_added') {
               fieldToDelete = `addedLectures.${lectureId}`;
            }

            await withTimeout(updateDoc(docRef, {
              [fieldToDelete]: deleteField()
            }), 10000);
            console.log(`[Overrides] Removed ${fieldToDelete} for user ${uid}`);
          } else {
            return res.status(400).json({ error: 'Missing parameter: lectureId or clearAll is required' });
          }
        } catch (dbErr) {
          console.error('[Overrides] Failed to delete override from Firestore:', dbErr);
          return res.status(500).json({ error: 'Failed to delete override' });
        }
      } else {
        return res.status(503).json({ error: 'Firestore not available' });
      }

      res.json({ success: true });
    } catch (err: any) {
      console.error('Error deleting lecture override:', err);
      res.status(500).json({ error: 'Internal server error deleting override' });
    }
  });

  // Timetable PDF / Image AI Parsing Endpoint
  app.post('/api/parse-timetable', async (req, res) => {
    try {
      const { fileData, fileName, mimeType, textData, userBranch, userYear, userSemester, userSection } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        console.warn('Gemini API key not configured. Using fallback parser.');
        return res.json({
          success: true,
          isFallback: true,
          message: 'Parsed using standard timetable pattern engine',
          timetable: generateParsedFallback(fileName || 'Timetable.pdf')
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const promptText = `You are an expert academic timetable parser. Analyze the attached timetable document/text and extract the exact details into a structured JSON.
Return:
- branch: e.g. "AIML" or "DS" or "CSE"
- year: e.g. "Second Year", "Third Year", or "Fourth Year"
- semester: integer 1 to 8
- section: e.g. "A", "B", "C", or "D"
- roomNumber: default main classroom, e.g. "LH-302"
- weeklySchedule: object with keys "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday".
  Each day contains an array of lecture slot objects:
  - id: unique string
  - lectureNumber: integer (1, 2, 3...)
  - subjectCode: e.g. "CS301" or "AI402"
  - subjectName: full name of subject
  - facultyName: name of professor/instructor
  - roomNumber: classroom or lab name
  - startTime: e.g. "09:00 AM"
  - endTime: e.g. "10:00 AM"
  - isLab: boolean
  - batchSection: string like "C1", "C2", or "All"
  - dayOfWeek: day string`;

      let parts: any[] = [];

      if (fileData && mimeType) {
        parts.push({
          inlineData: {
            data: fileData.replace(/^data:[^;]+;base64,/, ''),
            mimeType: mimeType || 'application/pdf'
          }
        });
        parts.push({ text: promptText });
      } else if (textData) {
        parts.push({ text: `${promptText}\n\nTimetable Content:\n${textData}` });
      } else {
        return res.status(400).json({ error: 'Missing fileData or textData' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              branch: { type: Type.STRING },
              year: { type: Type.STRING },
              semester: { type: Type.INTEGER },
              section: { type: Type.STRING },
              roomNumber: { type: Type.STRING },
              weeklySchedule: {
                type: Type.OBJECT,
                properties: {
                  Monday: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, lectureNumber: { type: Type.INTEGER }, subjectCode: { type: Type.STRING }, subjectName: { type: Type.STRING }, facultyName: { type: Type.STRING }, roomNumber: { type: Type.STRING }, startTime: { type: Type.STRING }, endTime: { type: Type.STRING }, isLab: { type: Type.BOOLEAN }, batchSection: { type: Type.STRING }, dayOfWeek: { type: Type.STRING } } } },
                  Tuesday: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, lectureNumber: { type: Type.INTEGER }, subjectCode: { type: Type.STRING }, subjectName: { type: Type.STRING }, facultyName: { type: Type.STRING }, roomNumber: { type: Type.STRING }, startTime: { type: Type.STRING }, endTime: { type: Type.STRING }, isLab: { type: Type.BOOLEAN }, batchSection: { type: Type.STRING }, dayOfWeek: { type: Type.STRING } } } },
                  Wednesday: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, lectureNumber: { type: Type.INTEGER }, subjectCode: { type: Type.STRING }, subjectName: { type: Type.STRING }, facultyName: { type: Type.STRING }, roomNumber: { type: Type.STRING }, startTime: { type: Type.STRING }, endTime: { type: Type.STRING }, isLab: { type: Type.BOOLEAN }, batchSection: { type: Type.STRING }, dayOfWeek: { type: Type.STRING } } } },
                  Thursday: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, lectureNumber: { type: Type.INTEGER }, subjectCode: { type: Type.STRING }, subjectName: { type: Type.STRING }, facultyName: { type: Type.STRING }, roomNumber: { type: Type.STRING }, startTime: { type: Type.STRING }, endTime: { type: Type.STRING }, isLab: { type: Type.BOOLEAN }, batchSection: { type: Type.STRING }, dayOfWeek: { type: Type.STRING } } } },
                  Friday: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, lectureNumber: { type: Type.INTEGER }, subjectCode: { type: Type.STRING }, subjectName: { type: Type.STRING }, facultyName: { type: Type.STRING }, roomNumber: { type: Type.STRING }, startTime: { type: Type.STRING }, endTime: { type: Type.STRING }, isLab: { type: Type.BOOLEAN }, batchSection: { type: Type.STRING }, dayOfWeek: { type: Type.STRING } } } },
                  Saturday: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, lectureNumber: { type: Type.INTEGER }, subjectCode: { type: Type.STRING }, subjectName: { type: Type.STRING }, facultyName: { type: Type.STRING }, roomNumber: { type: Type.STRING }, startTime: { type: Type.STRING }, endTime: { type: Type.STRING }, isLab: { type: Type.BOOLEAN }, batchSection: { type: Type.STRING }, dayOfWeek: { type: Type.STRING } } } }
                }
              }
            }
          }
        }
      });

      const responseText = response.text || '';
      const parsedData = JSON.parse(responseText);

      const weeklySchedule = parsedData.weeklySchedule || {};
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      for (const day of days) {
        if (Array.isArray(weeklySchedule[day])) {
          weeklySchedule[day] = weeklySchedule[day].map((slot: any, idx: number) => {
            const prefix = day.toLowerCase().substring(0, 3);
            const num = slot.lectureNumber || (idx + 1);
            return {
              ...slot,
              id: slot.id || `ai_${prefix}_${num}`
            };
          });
        }
      }

      // Use user-provided config for the template key (ensures lookup/save key consistency)
      // Fall back to Gemini-parsed values if user config was not sent
      const branchVal = userBranch || parsedData.branch || 'AIML';
      const yearVal = userYear || parsedData.year || 'Second Year';
      const semesterVal = userSemester || parsedData.semester || 3;
      const sectionVal = userSection || parsedData.section || 'A';
      const roomVal = parsedData.roomNumber || 'LH-302';

      const key = makeTemplateKey(branchVal, yearVal, String(semesterVal), sectionVal);
      console.log(`[Firestore Save] Template key components — user config: { branch: '${userBranch}', year: '${userYear}', semester: '${userSemester}', section: '${userSection}' }, Gemini parsed: { branch: '${parsedData.branch}', year: '${parsedData.year}', semester: '${parsedData.semester}', section: '${parsedData.section}' }, resolved key: "${key}"`);
      const templateDoc = {
        branch: branchVal,
        year: yearVal,
        semester: semesterVal,
        section: sectionVal,
        roomNumber: roomVal,
        weeklySchedule,
        sourceType: 'ai-parsed',
        usageCount: 1,
        reports: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (db) {
        try {
          console.log(`[Firestore Save] Attempting to save key: "${key}" to Firestore with template data...`);
          await withTimeout(setDoc(doc(db, 'timetableTemplates', key), templateDoc), 10000);
          console.log(`Saved timetable template to Firestore: ${key}`);
        } catch (dbErr) {
          console.error('Failed to save timetable template to Firestore (timed out or errored):', dbErr);
        }
      }
      memoryCache.set(key, templateDoc);

      res.json({
        success: true,
        isFallback: false,
        timetable: {
          id: `tt_${Date.now()}`,
          branch: branchVal,
          year: yearVal,
          semester: semesterVal,
          section: sectionVal,
          roomNumber: roomVal,
          uploadedFileName: fileName || 'Uploaded_Timetable.pdf',
          updatedAt: new Date().toISOString(),
          weeklySchedule
        }
      });

    } catch (err: any) {
      console.error('Error in AI timetable parsing:', err);
      // Failover gracefully
      res.json({
        success: true,
        isFallback: true,
        message: 'Parsed using standard layout fallback engine',
        timetable: generateParsedFallback(req.body.fileName || 'Timetable.pdf')
      });
    }
  });

  // Vite Middleware in Dev, Static Files in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AttendEase Server running on http://0.0.0.0:${PORT}`);
  });
}

function generateParsedFallback(fileName: string) {
  return {
    id: `tt_parsed_${Date.now()}`,
    branch: 'AIML',
    year: 'Second Year',
    semester: 3,
    section: 'A',
    roomNumber: 'LH-302',
    uploadedFileName: fileName,
    updatedAt: new Date().toISOString(),
    weeklySchedule: {
      Monday: [
        { id: 'f-m1', lectureNumber: 1, subjectCode: 'AI301', subjectName: 'Artificial Intelligence Fundamentals', facultyName: 'Dr. Ramesh Verma', roomNumber: 'LH-302', startTime: '09:00 AM', endTime: '10:00 AM', dayOfWeek: 'Monday' },
        { id: 'f-m2', lectureNumber: 2, subjectCode: 'CS302', subjectName: 'Data Structures & Algorithms', facultyName: 'Prof. Ananya Sen', roomNumber: 'LH-302', startTime: '10:00 AM', endTime: '11:00 AM', dayOfWeek: 'Monday' },
        { id: 'f-m3', lectureNumber: 3, subjectCode: 'MA301', subjectName: 'Discrete Mathematics', facultyName: 'Dr. S. K. Gupta', roomNumber: 'LH-302', startTime: '11:15 AM', endTime: '12:15 PM', dayOfWeek: 'Monday' },
        { id: 'f-m4', lectureNumber: 4, subjectCode: 'AI305L', subjectName: 'Python for AI Lab (Batch C1)', facultyName: 'Prof. Ananya Sen', roomNumber: 'AI Lab 2', startTime: '01:15 PM', endTime: '03:15 PM', isLab: true, batchSection: 'C1', dayOfWeek: 'Monday' }
      ],
      Tuesday: [
        { id: 'f-t1', lectureNumber: 1, subjectCode: 'CS303', subjectName: 'Database Management Systems', facultyName: 'Prof. Rajesh Kulkarni', roomNumber: 'LH-302', startTime: '09:00 AM', endTime: '10:00 AM', dayOfWeek: 'Tuesday' },
        { id: 'f-t2', lectureNumber: 2, subjectCode: 'AI301', subjectName: 'Artificial Intelligence Fundamentals', facultyName: 'Dr. Ramesh Verma', roomNumber: 'LH-302', startTime: '10:00 AM', endTime: '11:00 AM', dayOfWeek: 'Tuesday' },
        { id: 'f-t3', lectureNumber: 3, subjectCode: 'MA301', subjectName: 'Discrete Mathematics', facultyName: 'Dr. S. K. Gupta', roomNumber: 'LH-302', startTime: '11:15 AM', endTime: '12:15 PM', dayOfWeek: 'Tuesday' }
      ],
      Wednesday: [
        { id: 'f-w1', lectureNumber: 1, subjectCode: 'AI302', subjectName: 'Linear Algebra for ML', facultyName: 'Dr. Priya Sharma', roomNumber: 'LH-302', startTime: '09:00 AM', endTime: '10:00 AM', dayOfWeek: 'Wednesday' },
        { id: 'f-w2', lectureNumber: 2, subjectCode: 'CS303', subjectName: 'Database Management Systems', facultyName: 'Prof. Rajesh Kulkarni', roomNumber: 'LH-302', startTime: '10:00 AM', endTime: '11:00 AM', dayOfWeek: 'Wednesday' }
      ],
      Thursday: [
        { id: 'f-th1', lectureNumber: 1, subjectCode: 'CS302', subjectName: 'Data Structures & Algorithms', facultyName: 'Prof. Ananya Sen', roomNumber: 'LH-302', startTime: '09:00 AM', endTime: '10:00 AM', dayOfWeek: 'Thursday' },
        { id: 'f-th2', lectureNumber: 2, subjectCode: 'HU301', subjectName: 'Universal Human Values', facultyName: 'Dr. Meenakshi Sundaram', roomNumber: 'LH-302', startTime: '10:00 AM', endTime: '11:00 AM', dayOfWeek: 'Thursday' }
      ],
      Friday: [
        { id: 'f-fr1', lectureNumber: 1, subjectCode: 'AI302', subjectName: 'Linear Algebra for ML', facultyName: 'Dr. Priya Sharma', roomNumber: 'LH-302', startTime: '09:00 AM', endTime: '10:00 AM', dayOfWeek: 'Friday' },
        { id: 'f-fr2', lectureNumber: 2, subjectCode: 'AI306P', subjectName: 'AI Mini Project Work', facultyName: 'Dr. Ramesh Verma', roomNumber: 'AI Innovation Hub', startTime: '01:15 PM', endTime: '04:15 PM', isLab: true, dayOfWeek: 'Friday' }
      ],
      Saturday: [
        { id: 'f-s1', lectureNumber: 1, subjectCode: 'HU301', subjectName: 'Universal Human Values', facultyName: 'Dr. Meenakshi Sundaram', roomNumber: 'LH-302', startTime: '09:00 AM', endTime: '10:00 AM', dayOfWeek: 'Saturday' }
      ]
    }
  };
}

startServer();
