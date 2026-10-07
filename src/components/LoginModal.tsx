import React, { useState } from 'react';
import { useSis } from '../context/SisContext';
import { AsuCrest } from './AsuCrest';
import { Lock, User, ArrowRight, ShieldAlert, GraduationCap, Users, UserCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, switchRoleQuick } = useSis();
  const [idInput, setIdInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = login(idInput, pinInput);
    if (success) {
      onClose();
    } else {
      setErrorMsg('Invalid Academic ID or 4-digit PIN code.');
    }
  };

  const handleQuickDemo = (role: 'student' | 'advisor' | 'instructor' | 'admin', accountId?: string) => {
    switchRoleQuick(role, accountId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 relative">
          <div className="flex items-center gap-4">
            <AsuCrest className="w-14 h-14" />
            <div>
              <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                Ain Shams University · كلية العلوم
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Faculty of Science SIS Portal
              </h2>
              <p className="text-xs text-emerald-100/90 font-arabic" dir="rtl">
                بوابة نظام الساعات المعتمدة الأكاديمية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Demo Selector */}
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Instant Demo Access / اختر حساباً للتجربة السريعة:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('student', '2201045')}
                className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-950 font-medium text-left transition-colors flex flex-col"
              >
                <span className="font-semibold flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                  Student 1: Regular CS
                </span>
                <span className="text-[11px] text-emerald-800">CGPA: 3.40 · Max 19 Cr</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('student', '2201890')}
                className="p-2.5 rounded-lg border border-amber-300 bg-amber-50/70 hover:bg-amber-100/80 text-amber-950 font-medium text-left transition-colors flex flex-col"
              >
                <span className="font-semibold flex items-center gap-1.5 text-amber-900">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  Student 2: On Probation
                </span>
                <span className="text-[11px] text-amber-800 font-bold">CGPA: 1.85 · Max 12 Cr Cap</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('advisor')}
                className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-blue-950 font-medium text-left transition-colors flex flex-col"
              >
                <span className="font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-700" />
                  Academic Advisor
                </span>
                <span className="text-[11px] text-blue-800">Dr. Ahmed Ezzat</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('instructor')}
                className="p-2.5 rounded-lg border border-purple-200 bg-purple-50/60 hover:bg-purple-100/70 text-purple-950 font-medium text-left transition-colors flex flex-col"
              >
                <span className="font-semibold flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-purple-700" />
                  Course Instructor
                </span>
                <span className="text-[11px] text-purple-800">Dr. Nadia Mostafa</span>
              </button>
            </div>
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
              >
                Or login as System Administrator (Eng. Tarek Mansour)
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-xs uppercase text-slate-400 font-semibold">
              Or Enter Academic Credentials
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs font-medium text-rose-700 bg-rose-50 rounded-lg border border-rose-200">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student ID / Staff ID (الرقم الأكاديمي أو الوظيفي)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={idInput}
                  onChange={(e) => setIdInput(e.target.value)}
                  placeholder="e.g. 2201045 or ADV-301"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                4-Digit Security PIN (الرقم السري)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="4-digit PIN (e.g. 1234)"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-widest"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Sign In to SIS Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Modal Footer with Mandatory Branding */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 text-center text-xs text-slate-500">
          <p className="font-semibold text-slate-700">
            This program was developed by JVM CodeVerse team
          </p>
          <p className="font-arabic text-[11px] text-slate-500" dir="rtl">
            تم تطوير هذا البرنامج بواسطة فريق JVM CodeVerse
          </p>
        </div>
      </div>
    </div>
  );
};
