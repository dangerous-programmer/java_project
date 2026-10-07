import React, { useState } from 'react';
import { SisProvider, useSis } from './context/SisContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { StudentPortal } from './components/StudentPortal';
import { AdvisorPortal } from './components/AdvisorPortal';
import { InstructorPortal } from './components/InstructorPortal';
import { AdminPortal } from './components/AdminPortal';
import { LoginModal } from './components/LoginModal';
import { AsuCrest } from './components/AsuCrest';
import {
  GraduationCap,
  ShieldAlert,
  Users,
  UserCheck,
  Building,
  CheckCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentRole, currentUser, switchRoleQuick } = useSis();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <ToastContainer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!currentUser ? (
          /* Institutional Welcome & Portal Entry Screen */
          <div className="space-y-8 max-w-4xl mx-auto py-8">
            {/* Hero Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-8 sm:p-10 text-center relative">
              <div className="flex justify-center mb-5">
                <AsuCrest className="w-20 h-20" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-full mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Faculty of Science · Ain Shams University
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Student Information & Registration System (SIS)
              </h1>
              <p className="text-base sm:text-lg font-semibold text-slate-600 font-arabic mt-1" dir="rtl">
                نظام الساعات المعتمدة الأكاديمية · كلية العلوم - جامعة عين شمس
              </p>

              <p className="text-sm text-slate-600 max-w-2xl mx-auto mt-4 leading-relaxed">
                Official credit hour management platform adhering strictly to university bylaws.
                Features real-time prerequisite enforcement, automated academic probation caps (12 credit hours max for CGPA &lt; 2.00),
                advisor approval workflows, and live instructor grading.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => switchRoleQuick('student', '2201045')}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-sm flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Explore as Student (3.40 CGPA)</span>
                </button>

                <button
                  onClick={() => switchRoleQuick('student', '2201890')}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-sm flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Test Academic Probation (1.85 CGPA)</span>
                </button>

                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2"
                >
                  <span>Sign In with ID & PIN</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bylaw Rules Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-3">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Credit Hour Load Rules
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Regular full-time students register between <strong>12 to 19 credit hours</strong>.
                  Registration under 12 hours is blocked by system bylaws.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold mb-3">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Academic Probation (الملاحظة الأكاديمية)
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  When Cumulative GPA drops below <strong>2.00</strong>, students are automatically capped at
                  a maximum of <strong>12 credit hours</strong> to promote grade recovery.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Prerequisites Validation
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Courses enforce prerequisites hierarchically (e.g., MATH101 before MATH102; COMP104 before COMP201).
                  Failed prerequisite courses immediately block advanced enrollments.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Role-based Active Portals */
          <div>
            {currentRole === 'student' && <StudentPortal />}
            {currentRole === 'advisor' && <AdvisorPortal />}
            {currentRole === 'instructor' && <InstructorPortal />}
            {currentRole === 'admin' && <AdminPortal />}
          </div>
        )}
      </main>

      <Footer />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <SisProvider>
      <MainContent />
    </SisProvider>
  );
}
