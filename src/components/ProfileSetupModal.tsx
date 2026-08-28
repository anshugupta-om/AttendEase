import React, { useState } from 'react';
import { Branch, UserProfile, Year, SECTIONS, Section } from '../types';
import { User, Building, ArrowRight } from 'lucide-react';

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
  const [section, setSection] = useState<Section>((initialData?.section as Section) || 'A');
  const [batch, setBatch] = useState<string>(initialData?.batch || 'C1');
  const [collegeName, setCollegeName] = useState(initialData?.collegeName || 'National Institute of Technology');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      id: initialData?.id || `usr_${Date.now()}`,
      firebaseUid: initialData?.firebaseUid || initialData?.id,
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-bmw">
      <div className="bg-surface-card rounded-lg max-w-lg w-full border border-hairline-strong shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform hover:scale-105">
              AE
            </div>
          </div>
          <h2 className="text-xl font-bold text-ink uppercase tracking-[0.5px]">
            FIRST-TIME SETUP
          </h2>
          <p className="text-xs text-muted font-normal max-w-xs mx-auto">
            Configure your department branch, semester, and section to customize your timetable trackers.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-bold tracking-[1px] uppercase text-muted mb-1 font-mono">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-muted absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Rahul Sharma"
                className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-hairline-strong rounded-md text-xs text-ink focus:outline-none focus:border-text-link tracking-[0.5px]"
              />
            </div>
          </div>

          {/* Branch Selection Grid */}
          <div>
            <label className="block text-[10px] font-bold tracking-[1px] uppercase text-muted mb-1 font-mono">
              Department / Branch
            </label>
            <div className="grid grid-cols-4 gap-2">
              {branchesList.map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setBranch(b)}
                  className={`py-2 px-2 rounded-md text-[11px] font-bold tracking-[0.5px] uppercase transition-all border cursor-pointer ${
                    branch === b
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-canvas text-muted border-hairline-strong hover:bg-surface-soft hover:text-ink'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Year & Semester Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-[1px] uppercase text-muted mb-1 font-mono">
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value as Year)}
                className="w-full px-3 py-2.5 bg-canvas border border-hairline-strong rounded-md text-xs text-ink focus:outline-none focus:border-text-link tracking-[0.5px]"
              >
                {yearsList.map((y) => (
                  <option key={y} value={y} className="bg-surface-card text-ink">{y.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-[1px] uppercase text-muted mb-1 font-mono">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-canvas border border-hairline-strong rounded-md text-xs text-ink focus:outline-none focus:border-text-link tracking-[0.5px]"
              >
                {[3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s} className="bg-surface-card text-ink">SEMESTER {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section & Batch Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-[1px] uppercase text-muted mb-1 font-mono">
                Section
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as Section)}
                className="w-full px-3 py-2.5 bg-canvas border border-hairline-strong rounded-md text-xs text-ink focus:outline-none focus:border-text-link tracking-[0.5px]"
              >
                {SECTIONS.map((s) => (
                  <option key={s} value={s} className="bg-surface-card text-ink">SECTION {s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-[1px] uppercase text-muted mb-1 font-mono">
                Lab Batch (Optional)
              </label>
              <input
                type="text"
                value={batch}
                onChange={(e) => setBatch(e.target.value.toUpperCase())}
                autoComplete="off"
                placeholder="C1, C2"
                className="w-full px-3 py-2.5 bg-canvas border border-hairline-strong rounded-md text-xs text-ink focus:outline-none focus:border-text-link tracking-[0.5px]"
              />
            </div>
          </div>

          {/* College Name */}
          <div>
            <label className="block text-[10px] font-bold tracking-[1px] uppercase text-muted mb-1 font-mono">
              College / Institute Name
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-muted absolute left-3 top-3" />
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                autoComplete="organization"
                placeholder="National Institute of Technology"
                className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-hairline-strong rounded-md text-xs text-ink focus:outline-none focus:border-text-link tracking-[0.5px]"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-semibold text-xs rounded-md hover:bg-primary-active transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm border-0 animate-pulse"
          >
            <span>Save Configuration & Start</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
