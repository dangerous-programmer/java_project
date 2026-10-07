import React, { useState } from 'react';
import { useSis } from '../context/SisContext';
import { Student, Course } from '../types';
import {
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  Clock,
  BookOpen,
  ArrowRight,
  Send,
  MessageSquare,
  Award
} from 'lucide-react';

export const AdvisorPortal: React.FC = () => {
  const { students, courses, reviewRegistration, currentUser } = useSis();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [filterStanding, setFilterStanding] = useState<'all' | 'probation' | 'good'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [feedbackNotes, setFeedbackNotes] = useState<string>('Schedule reviewed and complies with credit hour bylaws.');

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Filter advisees
  const filteredAdvisees = students.filter((s) => {
    if (filterStanding === 'probation' && s.standing !== 'PROBATION') return false;
    if (filterStanding === 'good' && s.standing !== 'GOOD_STANDING') return false;
    if (filterStatus === 'pending' && s.registrationStatus !== 'pending_advisor') return false;
    if (filterStatus === 'approved' && s.registrationStatus !== 'approved') return false;
    if (filterStatus === 'rejected' && s.registrationStatus !== 'rejected') return false;
    return true;
  });

  // Calculate selected student registered courses
  const registeredCourseDetails = selectedStudent
    ? selectedStudent.currentRegistration.map((reg) => {
        const course = courses.find((c) => c.id === reg.courseId);
        return { ...reg, course };
      })
    : [];

  const totalRegisteredCredits = registeredCourseDetails.reduce(
    (sum, r) => sum + (r.course?.credits || 0),
    0
  );

  const handleDecision = (decision: 'approved' | 'rejected') => {
    if (!selectedStudent) return;
    reviewRegistration(selectedStudent.id, decision, feedbackNotes);
  };

  const probationCount = students.filter((s) => s.standing === 'PROBATION').length;
  const pendingCount = students.filter((s) => s.registrationStatus === 'pending_advisor').length;

  return (
    <div className="space-y-6">
      {/* Advisor Header & KPI Strip */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
              Academic Advising Portal · مكتب الإرشاد الأكاديمي
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Dr. Ahmed Ezzat · Faculty Academic Advisor
            </h1>
            <p className="text-xs text-slate-500 font-arabic" dir="rtl">
              متابعة وتسجيل المقررات لطلاب قسمي الحاسب والرياضيات
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <div className="text-[10px] font-semibold text-blue-700 uppercase">
                Total Advisees
              </div>
              <div className="text-lg font-bold font-mono text-blue-900">
                {students.length}
              </div>
            </div>

            <div className="px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-lg text-center">
              <div className="text-[10px] font-semibold text-amber-700 uppercase">
                Pending Review
              </div>
              <div className="text-lg font-bold font-mono text-amber-900">
                {pendingCount}
              </div>
            </div>

            <div className="px-3.5 py-2 bg-rose-50 border border-rose-200 rounded-lg text-center">
              <div className="text-[10px] font-semibold text-rose-700 uppercase">
                On Probation
              </div>
              <div className="text-lg font-bold font-mono text-rose-900">
                {probationCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split View: Advisees List & Detailed Cart Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Advisees List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-700" />
                <span>Assigned Advisees (الطلاب تحت الإرشاد)</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                {filteredAdvisees.length} Students
              </span>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap gap-2 text-xs mb-3">
              <button
                onClick={() => setFilterStanding('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterStanding === 'all'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStanding('probation')}
                className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  filterStanding === 'probation'
                    ? 'bg-amber-700 text-white font-medium'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <ShieldAlert className="w-3 h-3" />
                <span>Probation Only ({probationCount})</span>
              </button>
              <button
                onClick={() => setFilterStanding('good')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterStanding === 'good'
                    ? 'bg-emerald-700 text-white font-medium'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Good Standing
              </button>
            </div>

            {/* Student list */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredAdvisees.map((s) => {
                const isSelected = s.id === selectedStudentId;
                const isProb = s.standing === 'PROBATION';

                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedStudentId(s.id);
                      if (s.advisorNotes) setFeedbackNotes(s.advisorNotes);
                    }}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {s.nameEn}
                        </div>
                        <div className="text-[11px] text-slate-500 font-arabic" dir="rtl">
                          {s.nameAr}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 font-mono">
                          ID: {s.id} · Major: {s.major}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`font-mono font-bold text-sm tabular-nums ${
                            isProb ? 'text-amber-700' : 'text-emerald-700'
                          }`}
                        >
                          GPA: {s.cgpa.toFixed(2)}
                        </div>
                        <span
                          className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            isProb
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isProb ? 'Probation (12 Cr)' : 'Good Standing'}
                        </span>
                      </div>
                    </div>

                    {/* Registration status badge */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Cart Status:</span>
                      <span
                        className={`font-semibold capitalize ${
                          s.registrationStatus === 'approved'
                            ? 'text-emerald-700 flex items-center gap-1'
                            : s.registrationStatus === 'pending_advisor'
                            ? 'text-amber-700 font-bold flex items-center gap-1'
                            : s.registrationStatus === 'rejected'
                            ? 'text-rose-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {s.registrationStatus === 'pending_advisor' && '⏳ Pending Approval'}
                        {s.registrationStatus === 'approved' && '✓ Approved'}
                        {s.registrationStatus === 'rejected' && '✗ Rejected'}
                        {s.registrationStatus === 'draft' && 'Draft (in progress)'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Detailed Cart Inspection & Decision Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedStudent ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
              {/* Inspection Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      {selectedStudent.nameEn}
                    </h2>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        selectedStudent.standing === 'PROBATION'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {selectedStudent.standing === 'PROBATION'
                        ? 'Academic Probation'
                        : 'Good Standing'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    ID: {selectedStudent.id} · Major: {selectedStudent.major} · Level {selectedStudent.level}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Cumulative GPA:</div>
                  <div className="font-mono font-bold text-xl text-slate-900">
                    {selectedStudent.cgpa.toFixed(2)} / 4.00
                  </div>
                </div>
              </div>

              {/* Standing Alert for Advisor */}
              {selectedStudent.standing === 'PROBATION' && (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Advisor Bylaw Notice: </strong>
                    Student is under Academic Probation (CGPA {selectedStudent.cgpa.toFixed(2)} &lt; 2.00).
                    Under Ain Shams University regulations, registration cannot exceed <strong>12 Credit Hours</strong>.
                    Ensure the student has included failed prerequisite courses (e.g., MATH101) for repeating.
                  </div>
                </div>
              )}

              {/* Registered Courses in Request */}
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-700">
                  <span>Registered Courses for Current Semester:</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                    Total Load: {totalRegisteredCredits} / {selectedStudent.maxCreditsAllowed} Cr
                  </span>
                </div>

                {registeredCourseDetails.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-xl">
                    Student has not added any courses to their registration cart yet.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                    {registeredCourseDetails.map((item, idx) => {
                      const c = item.course;
                      if (!c) return null;

                      // Check if prerequisites are passed
                      const missingPrereqs = c.prerequisites.filter((pre) => {
                        return !selectedStudent.transcript.some((t) => t.courseCode === pre && t.passed);
                      });

                      return (
                        <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900">
                                {c.code}
                              </span>
                              <span className="text-slate-800 font-medium">
                                {c.nameEn}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {c.schedule.day} {c.schedule.time} · {c.schedule.room} · {c.department}
                            </div>
                            {missingPrereqs.length > 0 && (
                              <div className="text-[11px] text-rose-600 font-semibold mt-0.5 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Missing Prerequisite: {missingPrereqs.join(', ')}</span>
                              </div>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {c.credits} Cr
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Advisor Feedback & Decision Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-700" />
                  <span>Advisor Comments & Recommendations (ملاحظات وتوجيهات المرشد):</span>
                </label>
                <textarea
                  rows={3}
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="Enter academic advice or specific conditions for this student's schedule..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleDecision('rejected')}
                    className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Schedule (طلب تعديل الجدول)</span>
                  </button>

                  <button
                    onClick={() => handleDecision('approved')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve Registration (اعتماد التسجيل)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
              Select an advisee from the list to inspect their registration.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
