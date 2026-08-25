import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  FileText, 
  ArrowRight, 
  GraduationCap, 
  Moon, 
  Sun, 
  CheckCircle,
  Clock,
  ShieldCheck,
  Check,
  X,
  Play
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  theme, 
  onToggleTheme 
}) => {
  return (
    <div className="min-h-screen bg-canvas text-ink transition-colors duration-200 antialiased selection:bg-brand-pink selection:text-white font-bmw">
      {/* Top Navigation */}
      <nav className="border-b border-hairline bg-canvas sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform hover:scale-105">
                AE
              </div>
              <span className="text-base font-semibold tracking-[-0.5px] text-ink">
                AttendEase <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-strong border border-hairline-strong text-ink">GTC</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onToggleTheme}
              className="p-2 sm:p-2.5 rounded-md bg-canvas text-muted hover:text-ink border border-hairline hover:border-hairline-strong transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onGetStarted}
              className="px-5 py-2 text-xs font-semibold rounded-md text-white bg-primary hover:bg-primary-active transition-all cursor-pointer shadow-sm border-0"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Expo Style Sky Wash Gradient Header Divider */}
      <div className="m-stripe" />

      {/* Hero Section with Sky wash background */}
      <section className="relative pt-12 pb-16 sm:pt-24 sm:pb-24 overflow-hidden bg-gradient-to-b from-[#cfe7ff] via-canvas to-canvas dark:from-slate-900/30 dark:via-canvas dark:to-canvas">
        {/* Soft grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--hairline-strong)_1px,transparent_1px),linear-gradient(to_bottom,var(--hairline-strong)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-surface-strong border border-hairline-strong text-ink text-xs font-semibold rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
                <span>AI-Powered Classroom Orchestration</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-ink tracking-[-1.92px] leading-[1.05]">
                Go to class with{' '}
                <span className="text-brand-pink font-semibold">
                  intelligent schedules.
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-body max-w-xl leading-relaxed font-normal">
                Upload your official college schedule and let our intelligent engine parse classrooms, timetables, and subjects. Track daily attendance and safeguard your 75% eligibility with B2B SaaS precision.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 max-w-md">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-semibold text-sm rounded-md hover:bg-primary-active transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm border-0"
                >
                  <span>Start Orchestrating</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#features"
                  className="w-full sm:w-auto px-6 py-3 bg-canvas text-ink font-semibold text-sm rounded-md border border-hairline-strong hover:bg-surface-soft hover:border-muted transition-all flex items-center justify-center"
                >
                  Explore Specs
                </a>
              </div>
            </div>

            {/* Right Hero Column - MacBook + iPhone Device Mockup (5 cols) */}
            <div className="lg:col-span-5 flex justify-center relative">
              {/* MacBook Mockup */}
              <div className="w-full max-w-md bg-surface-dark p-4 rounded-xl border border-hairline-strong shadow-2xl space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[1px] text-white/50 font-mono">EAS Terminal Parser</span>
                </div>

                {/* Mock Timetable Card UI */}
                <div className="space-y-2">
                  <div className="bg-canvas-soft p-3 rounded-lg border border-hairline-strong flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-ink leading-tight">Artificial Intelligence</span>
                      <span className="text-[10px] text-muted font-normal mt-0.5 font-mono">09:00 AM • Room LH-302</span>
                    </div>
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full">
                      Present
                    </span>
                  </div>

                  <div className="bg-canvas-soft p-3 rounded-lg border border-hairline-strong flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-ink leading-tight">Data Structures & Algos</span>
                      <span className="text-[10px] text-muted font-normal mt-0.5 font-mono">10:00 AM • Room LH-302</span>
                    </div>
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full">
                      Present
                    </span>
                  </div>

                  <div className="bg-canvas-soft p-3 rounded-lg border border-hairline-strong flex items-center justify-between opacity-50">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-ink leading-tight">Database Systems</span>
                      <span className="text-[10px] text-muted font-normal mt-0.5 font-mono">11:15 AM • Room LH-302</span>
                    </div>
                    <span className="px-2 py-0.5 bg-canvas text-muted text-[10px] font-bold rounded-full border border-hairline-strong">
                      Scheduled
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-[10px] text-white/50 font-bold border-t border-white/10 font-mono">
                  <span>Nit-A3 • Year 3</span>
                  <span className="text-green-400">75% TARGET SAFE</span>
                </div>

                {/* iPhone Floating Overlay Screen Mockup */}
                <div className="absolute bottom-4 right-4 w-40 bg-surface-card p-3 rounded-lg border border-hairline-strong shadow-xl space-y-2 hidden sm:block transform translate-y-4 translate-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mx-auto" />
                  <div className="text-[8px] font-mono text-muted uppercase text-center tracking-[0.5px]">Expo Go Simulator</div>
                  <div className="bg-canvas-soft p-1.5 rounded border border-hairline-strong text-[9px] flex items-center justify-between">
                    <span className="font-bold truncate max-w-[70px]">L4: DBMS</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-pink" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="m-stripe" />

      {/* Features Grid */}
      <section id="features" className="py-20 sm:py-24 bg-canvas-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Core Technical Specifications
            </h2>
            <p className="text-body max-w-xl mx-auto text-xs sm:text-sm font-normal px-4 sm:px-0">
              High-performance mechanics designed to bypass administrative bottlenecks and monitor requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 - White card */}
            <div className="bg-surface-card p-7 rounded-lg flex flex-col justify-between h-72 border border-hairline-strong shadow-sm">
              <div className="w-10 h-10 bg-canvas border border-hairline-strong text-brand-pink flex items-center justify-center rounded-md shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-2 mt-auto">
                <span className="text-[10px] font-bold tracking-[0.5px] text-muted font-mono uppercase block">
                  MODULE 01 / PARSER
                </span>
                <h3 className="text-lg font-bold tracking-tight text-ink">
                  Timetable Parsing
                </h3>
                <p className="text-xs text-body leading-relaxed">
                  Direct extraction of subject codes, class schedules, and lab batches from uploaded documents via Gemini AI.
                </p>
              </div>
            </div>

            {/* Feature 2 - White Card */}
            <div className="bg-surface-card p-7 rounded-lg flex flex-col justify-between h-72 border border-hairline-strong shadow-sm">
              <div className="w-10 h-10 bg-canvas border border-hairline-strong text-brand-teal flex items-center justify-center rounded-md shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-2 mt-auto">
                <span className="text-[10px] font-bold tracking-[0.5px] text-muted font-mono uppercase block">
                  MODULE 02 / LOGS
                </span>
                <h3 className="text-lg font-bold tracking-tight text-ink">
                  Structured Matrix
                </h3>
                <p className="text-xs text-body leading-relaxed">
                  Simple checkbox system to log Present, Absent, Cancelled, and Holiday classes with calendar persistence.
                </p>
              </div>
            </div>

            {/* Feature 3 - White Card */}
            <div className="bg-surface-card p-7 rounded-lg flex flex-col justify-between h-72 border border-hairline-strong shadow-sm">
              <div className="w-10 h-10 bg-canvas border border-hairline-strong text-brand-pink flex items-center justify-center rounded-md shadow-sm">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-2 mt-auto">
                <span className="text-[10px] font-bold tracking-[0.5px] text-muted font-mono uppercase block">
                  MODULE 03 / ANALYTICS
                </span>
                <h3 className="text-lg font-bold tracking-tight text-ink">
                  75% Safety Alert
                </h3>
                <p className="text-xs text-body leading-relaxed">
                  Calculates exact metrics showing class counts required to satisfy college attendance eligibility limits.
                </p>
              </div>
            </div>

            {/* Feature 4 - Dark Code Block Card */}
            <div className="bg-surface-dark p-7 rounded-lg flex flex-col justify-between h-72 border border-hairline-strong shadow-sm text-white">
              <div className="w-10 h-10 bg-white/10 text-white flex items-center justify-center rounded-md shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-2 mt-auto">
                <span className="text-[10px] font-bold tracking-[0.5px] text-white/50 font-mono uppercase block">
                  MODULE 04 / COMPILER
                </span>
                <h3 className="text-lg font-bold tracking-tight">
                  PDF Certificates
                </h3>
                <p className="text-xs text-white/80 leading-relaxed font-mono">
                  $ npx export-logs --format=dean-office --target=hod
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="m-stripe" />

      {/* Step Guide */}
      <section className="py-20 sm:py-24 bg-canvas">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Deployment Sequence
            </h2>
            <p className="text-body text-xs sm:text-sm font-normal">
              Get your engine running in under 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-card p-6 border border-hairline-strong space-y-3 rounded-lg shadow-sm">
              <span className="text-xs font-bold text-brand-pink block font-mono">STAGE 01</span>
              <h3 className="text-base font-bold text-ink tracking-tight">Register Account</h3>
              <p className="text-xs text-body leading-relaxed">
                Configure credentials securely using Firebase integration (Google login support).
              </p>
            </div>

            <div className="bg-surface-card p-6 border border-hairline-strong space-y-3 rounded-lg shadow-sm">
              <span className="text-xs font-bold text-brand-teal block font-mono">STAGE 02</span>
              <h3 className="text-base font-bold text-ink tracking-tight">Deploy Specs</h3>
              <p className="text-xs text-body leading-relaxed">
                Add your department branch, academic year, semester, and batch details to configure defaults.
              </p>
            </div>

            <div className="bg-surface-card p-6 border border-hairline-strong space-y-3 rounded-lg shadow-sm">
              <span className="text-xs font-bold text-brand-pink block font-mono">STAGE 03</span>
              <h3 className="text-base font-bold text-ink tracking-tight">Launch Tracker</h3>
              <p className="text-xs text-body leading-relaxed">
                Upload schedule layouts and mark attendance daily from your personalized dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="m-stripe" />

      {/* Pre-footer CTA */}
      <section className="py-20 sm:py-24 bg-canvas border-b border-hairline-strong">
        <div className="max-w-4xl mx-auto text-center px-4 space-y-6">
          <GraduationCap className="w-12 h-12 text-brand-pink mx-auto animate-pulse" />
          <h2 className="text-3xl font-semibold text-ink tracking-tight">
            Launch Your Tracker Today
          </h2>
          <p className="text-sm text-body max-w-sm mx-auto leading-relaxed">
            Eliminate loose paper trails. Connect your dashboard to live database sync today.
          </p>
          <div className="pt-2">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-10 py-3.5 bg-primary text-white font-semibold text-sm rounded-md hover:bg-primary-active transition-all cursor-pointer shadow-md border-0"
            >
              Sign In Now
            </button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-muted font-bold px-2 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-pink" /> Firebase Auth
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-brand-teal" /> Real-time Sync
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-pink" /> 8px Compact Corners
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-canvas text-xs text-body">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-ink">AttendEase GTC</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex space-x-6 font-normal">
            <a href="#" className="hover:text-ink transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-ink transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-ink transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
