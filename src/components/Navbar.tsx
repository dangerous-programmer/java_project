import React, { useState } from 'react';
import { useSis } from '../context/SisContext';
import { AsuCrest } from './AsuCrest';
import { LoginModal } from './LoginModal';
import { UserRole, Student } from '../types';
import { LogOut, LogIn, Globe, ShieldAlert, Award, User, RefreshCw } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentRole,
    language,
    setLanguage,
    logout,
    switchRoleQuick,
    students,
  } = useSis();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Active status helper
  const isStudent1 = currentRole === 'student' && currentUser?.id === '2201045';
  const isStudent2 = currentRole === 'student' && currentUser?.id === '2201890';
  const isAdvisor = currentRole === 'advisor';
  const isInstructor = currentRole === 'instructor';
  const isAdmin = currentRole === 'admin';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
        {/* Top Role Switcher Sub-Bar for high-efficiency testing */}
        <div className="bg-slate-900 text-slate-200 px-4 py-1.5 border-b border-slate-800 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-emerald-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Quick Role-Switcher:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                <button
                  onClick={() => switchRoleQuick('student', '2201045')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                    isStudent1
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Normal Standing Student, Level 2 CS, CGPA: 3.40 (19 Cr Limit)"
                >
                  <Award className="w-3 h-3 text-emerald-300" />
                  <span>Student 1 (Reg. 3.40 GPA)</span>
                </button>

                <button
                  onClick={() => switchRoleQuick('student', '2201890')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                    isStudent2
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                  }`}
                  title="Probation Student, CGPA: 1.85 (Strict 12 Cr Limit)"
                >
                  <ShieldAlert className="w-3 h-3 text-amber-300" />
                  <span>Student 2 (Probation 1.85 GPA)</span>
                </button>

                <button
                  onClick={() => switchRoleQuick('advisor')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                    isAdvisor
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Academic Advisor Dr. Ahmed Ezzat"
                >
                  <span>Advisor (Dr. Ahmed)</span>
                </button>

                <button
                  onClick={() => switchRoleQuick('instructor')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                    isInstructor
                      ? 'bg-purple-600 text-white font-bold shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Course Instructor Dr. Nadia Mostafa"
                >
                  <span>Instructor (Dr. Nadia)</span>
                </button>

                <button
                  onClick={() => switchRoleQuick('admin')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                    isAdmin
                      ? 'bg-rose-700 text-white font-bold shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="System Administrator Eng. Tarek Mansour"
                >
                  <span>Admin (Catalog & Stats)</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="hidden sm:inline">Credit Hour Bylaws Active</span>
              <span className="text-emerald-400 font-mono">ASU-SCI-2026</span>
            </div>
          </div>
        </div>

        {/* Main Header Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Zone 1: University Brand Title */}
            <div className="flex items-center gap-3 shrink-0">
              <AsuCrest className="w-11 h-11" />
              <div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentRole === 'student') switchRoleQuick('student');
                  }}
                  className="block text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-snug hover:text-emerald-800 transition-colors"
                >
                  Ain Shams Science SIS
                </a>
                <p className="text-xs text-slate-500 font-medium font-arabic" dir="rtl">
                  كلية العلوم · جامعة عين شمس · نظام الساعات المعتمدة
                </p>
              </div>
            </div>

            {/* Zone 2: Navigation Info / Mode Indicator */}
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-medium text-slate-700">Active Role:</span>
                <span className="capitalize font-semibold text-slate-900">
                  {currentRole === 'student'
                    ? `Student (${(currentUser as Student)?.standing === 'PROBATION' ? 'Probation' : 'Good Standing'})`
                    : currentRole || 'Guest'}
                </span>
              </div>
            </div>

            {/* Zone 3: Actions (Language, User profile, Login/Logout) */}
            <div className="flex items-center gap-2.5">
              {/* Language Switch */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                title="Toggle English / Arabic display terms"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'en' ? 'العربية' : 'English'}</span>
              </button>

              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {language === 'ar' ? currentUser.nameAr : currentUser.nameEn}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      ID: {currentUser.id}
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};
