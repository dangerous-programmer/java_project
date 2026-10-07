import React from 'react';
import { useSis } from '../context/SisContext';
import { GraduationCap, RotateCcw, ShieldCheck, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  const { resetSimulationData, language } = useSis();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      {/* Mandatory Brand Banner */}
      <div className="bg-emerald-950 text-emerald-100 py-3.5 px-4 text-center border-b border-emerald-900/50 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm font-semibold">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            This program was developed by JVM CodeVerse team
          </span>
          <span className="hidden sm:inline text-emerald-600">|</span>
          <span className="text-emerald-300 font-medium font-arabic text-sm" dir="rtl">
            تم تطوير هذا البرنامج بواسطة فريق JVM CodeVerse
          </span>
        </div>
      </div>

      {/* Institutional Details & Bylaws reference */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                Ain Shams University · Faculty of Science · Credit Hour Academic Bylaws
              </p>
              <p className="text-slate-500 font-arabic" dir="rtl">
                جامعة عين شمس · كلية العلوم · اللائحة الأكاديمية لنظام الساعات المعتمدة
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-600">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Normal Load: 12–19 Cr / Probation Cap: 12 Cr</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Prerequisite Enforced (Bylaw Art. 14)</span>
            </div>
            <button
              onClick={resetSimulationData}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              title="Reset simulation data to default initial state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Simulation</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
