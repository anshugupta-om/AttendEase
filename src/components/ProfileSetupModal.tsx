import React, { useState } from 'react';
import { Branch, UserProfile, Year } from '../types';
import { User, GraduationCap, Building, Sparkles, ArrowRight } from 'lucide-react';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onSave: (profile: UserProfile) => void;
  initialData?: UserProfile | null;
}

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  isOpen,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || 'Rahul Sharma');
  const [email, setEmail] = useState(initialData?.email || 'rahul.sharma@student.edu');
  const [branch, setBranch] = useState<Branch>(initialData?.branch || 'AIML');
  const [year, setYear] = useState<Year>(initialData?.year || 'Second Year');
  const [semester, setSemester] = useState<number>(initialData?.semester || 3);
  const [section, setSection] = useState<string>(initialData?.section || 'A');
  const [batch, setBatch] = useState<string>(initialData?.batch || 'C1');
  const [collegeName, setCollegeName] = useState(initialData?.collegeName || 'National Institute of Technology');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      id: initialData?.id || `usr_${Date.now()}`,
      name,
      email,
      branch,
      year,
      semester,
      section,
      batch,
      collegeName,
      firstTimeSetupCompleted: true,
      themePreference: initialData?.themePreference || 'light'
    };
    onSave(updated);
  };

  const branchesList: Branch[] = ['AIML', 'DS', 'CSE', 'IT', 'ECE', 'MECH', 'CIVIL'];
  const yearsList: Year[] = ['Second Year', 'Third Year', 'Fourth Year'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black flex items-center justify-center text-lg mx-auto shadow-md shadow-indigo-600/30">
            AE
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">
            First-Time Profile Setup
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Configure your branch, semester, and section to customize your timetable and attendance tracker.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Branch Selection Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Department / Branch
            </label>
            <div className="grid grid-cols-4 gap-2">
              {branchesList.map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setBranch(b)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    branch === b
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Year & Semester Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value as Year)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                {yearsList.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                {[3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section & Batch Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Section
              </label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value.toUpperCase())}
                placeholder="A, B, or C"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Lab Batch (Optional)
              </label>
              <input
                type="text"
                value={batch}
                onChange={(e) => setBatch(e.target.value.toUpperCase())}
                placeholder="C1, C2, D1"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 uppercase"
              />
            </div>
          </div>

          {/* College Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              College / Institute Name
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="National Institute of Technology"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 pt-3"
          >
            <span>Save Profile & Start Tracking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
