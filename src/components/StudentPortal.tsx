import React, { useState } from 'react';
import { useSis } from '../context/SisContext';
import { Student, Course } from '../types';
import {
  BookOpen,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Send,
  Printer,
  Search,
  Filter,
  ShieldAlert,
  Award,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const {
    currentUser,
    courses,
    registerCourse,
    dropCourse,
    submitRegistrationCart,
    language,
    students,
  } = useSis();

  const [activeTab, setActiveTab] = useState<'registration' | 'transcript' | 'schedule'>('registration');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterEligibleOnly, setFilterEligibleOnly] = useState<boolean>(false);

  // Safely cast or find student
  const student = (currentUser as Student) || students[0];

  // Calculate current registered credit hours
  const registeredCourseIds = student.currentRegistration.map((r) => r.courseId);
  const registeredCourses = courses.filter((c) => registeredCourseIds.includes(c.id));
  const currentRegisteredCredits = registeredCourses.reduce((sum, c) => sum + c.credits, 0);

  // Departments list
  const departments = ['All', 'Computer Science', 'Mathematics', 'Statistics', 'Biophysics', 'Chemistry', 'General Science'];

  // Check course eligibility for student
  const checkCourseEligibility = (course: Course) => {
    // 1. Is already in current registration?
    const isRegistered = registeredCourseIds.includes(course.id);
    if (isRegistered) return { eligible: false, reason: 'Already in Registration Cart / مسجل حالياً', status: 'registered' };

    // 2. Is already passed in transcript?
    const passedEntry = student.transcript.find(
      (t) => (t.courseId === course.id || t.courseCode === course.code) && t.passed
    );
    if (passedEntry) {
      return {
        eligible: false,
        reason: `Passed in ${passedEntry.semesterName} (Grade ${passedEntry.letterGrade})`,
        status: 'passed',
      };
    }

    // 3. Are prerequisites met?
    if (course.prerequisites && course.prerequisites.length > 0) {
      const missingPrereqs: string[] = [];
      for (const prereqCode of course.prerequisites) {
        const passed = student.transcript.find((t) => t.courseCode === prereqCode && t.passed);
        if (!passed) {
          missingPrereqs.push(prereqCode);
        }
      }
      if (missingPrereqs.length > 0) {
        return {
          eligible: false,
          reason: `Missing Prerequisite: ${missingPrereqs.join(', ')}`,
          status: 'prereq_missing',
          missingPrereqs,
        };
      }
    }

    // 4. Capacity full?
    if (course.enrolled >= course.capacity) {
      return { eligible: false, reason: 'Course Capacity Full / مكتمل السعة', status: 'full' };
    }

    // 5. Would it exceed credit limit?
    if (currentRegisteredCredits + course.credits > student.maxCreditsAllowed) {
      return {
        eligible: false,
        reason: `Exceeds max load (${student.maxCreditsAllowed} Cr limit)`,
        status: 'credit_limit',
      };
    }

    return { eligible: true, reason: 'Eligible for Registration', status: 'eligible' };
  };

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    if (selectedDept !== 'All' && course.department !== selectedDept) return false;
    if (
      searchQuery &&
      !course.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !course.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !course.nameAr.includes(searchQuery)
    ) {
      return false;
    }
    if (filterEligibleOnly) {
      const { eligible } = checkCourseEligibility(course);
      return eligible;
    }
    return true;
  });

  const isProbation = student.standing === 'PROBATION';

  return (
    <div className="space-y-6">
      {/* 1. Academic Profile Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Student Info */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
                {student.nameEn.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-slate-900">
                    {student.nameEn}
                  </h1>
                  <span className="text-sm font-semibold text-slate-500 font-arabic" dir="rtl">
                    ({student.nameAr})
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="font-mono font-medium text-slate-700">ID: {student.id}</span>
                  <span aria-hidden="true">·</span>
                  <span>Major: <strong className="text-slate-800">{student.major}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Level {student.level} (المستوى الدراسي)</span>
                  <span aria-hidden="true">·</span>
                  <span>Advisor: <strong className="text-slate-800">{student.advisorName}</strong></span>
                </div>
              </div>
            </div>

            {/* GPA & Standing Metrics */}
            <div className="flex flex-wrap items-center gap-3">
              {/* CGPA Box */}
              <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-[110px]">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  CGPA (المعدل التراكمي)
                </div>
                <div
                  className={`text-2xl font-bold font-mono tabular-nums ${
                    isProbation ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {student.cgpa.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400">Scale 4.00</div>
              </div>

              {/* Earned Credits Box */}
              <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-[110px]">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Earned Credits
                </div>
                <div className="text-2xl font-bold font-mono text-slate-800 tabular-nums">
                  {student.completedCredits}
                </div>
                <div className="text-[10px] text-slate-400">Hours Passed</div>
              </div>

              {/* Standing Badge */}
              <div
                className={`p-3 rounded-xl border max-w-xs ${
                  isProbation
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  {isProbation ? (
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span>
                    {isProbation ? 'Academic Probation (ملاحظة أكاديمية)' : 'Good Standing (وضع منتظم)'}
                  </span>
                </div>
                <p className="text-[11px] mt-1 leading-snug">
                  {isProbation
                    ? 'CGPA < 2.00: Strict 12-hour semester limit enforced per Ain Shams bylaws.'
                    : 'Permitted semester load: 12 to 19 credit hours.'}
                </p>
              </div>
            </div>
          </div>

          {/* Probation Notice Banner if on probation */}
          {isProbation && (
            <div className="mt-4 p-3.5 bg-amber-50/80 border border-amber-200 rounded-lg flex items-start gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="font-semibold">Academic Warning (تنبيه أكاديمي): </strong>
                Because your Cumulative GPA is {student.cgpa.toFixed(2)} (below the 2.00 threshold),
                Ain Shams University Credit Hour Bylaw Article 19 places you under Academic Probation.
                Your semester registration is strictly capped at a <strong>maximum of 12 credit hours</strong> to
                allow academic recovery. You must prioritize repeating failed courses (such as MATH101).
              </div>
            </div>
          )}

          {/* Credit Load Progress Bar */}
          <div className="mt-5 pt-5 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Current Semester Credit Load:</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {currentRegisteredCredits} / {student.maxCreditsAllowed} Credit Hours
                </span>
                {currentRegisteredCredits < 12 && (
                  <span className="text-amber-700 font-medium text-[11px] bg-amber-100 px-2 py-0.5 rounded">
                    Minimum 12 Cr required to submit
                  </span>
                )}
                {currentRegisteredCredits >= 12 && (
                  <span className="text-emerald-700 font-medium text-[11px] bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Valid Credit Load
                  </span>
                )}
              </div>
              <div className="text-slate-500 text-[11px]">
                Normal Range: 12–19 Cr · Probation Cap: 12 Cr
              </div>
            </div>

            {/* Gauge Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex relative">
              {/* Threshold mark for 12 hours */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                style={{ left: `${(12 / (isProbation ? 12 : 19)) * 100}%` }}
                title="Minimum 12 Credit Hours Threshold"
              ></div>
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  currentRegisteredCredits < 12
                    ? 'bg-amber-500'
                    : currentRegisteredCredits > student.maxCreditsAllowed
                    ? 'bg-rose-600'
                    : 'bg-emerald-600'
                }`}
                style={{
                  width: `${Math.min(100, (currentRegisteredCredits / student.maxCreditsAllowed) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-50/70 border-t border-slate-200 px-6 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('registration')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'registration'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Course Registration (تسجيل المقررات)</span>
            {registeredCourses.length > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 font-mono">
                {registeredCourses.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('transcript')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'transcript'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Academic Transcript (السجل الأكاديمي)</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'border-emerald-700 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Weekly Schedule (الجدول الدراسي)</span>
          </button>
        </div>
      </div>

      {/* 2. Tab Content */}
      {activeTab === 'registration' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Course Catalog (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search code or course title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
                  <Filter className="w-3.5 h-3.5" /> Dept:
                </span>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer ml-2 shrink-0">
                  <input
                    type="checkbox"
                    checked={filterEligibleOnly}
                    onChange={(e) => setFilterEligibleOnly(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Eligible Only</span>
                </label>
              </div>
            </div>

            {/* Courses List */}
            <div className="space-y-3">
              {filteredCourses.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
                  <p className="text-sm font-semibold">No courses match your filter criteria.</p>
                  <p className="text-xs mt-1">Try clearing the search or changing department filters.</p>
                </div>
              ) : (
                filteredCourses.map((course) => {
                  const eligibility = checkCourseEligibility(course);
                  const isRegistered = registeredCourseIds.includes(course.id);
                  const capacityPercent = Math.round((course.enrolled / course.capacity) * 100);
                  const isFull = course.enrolled >= course.capacity;

                  return (
                    <div
                      key={course.id}
                      className={`bg-white rounded-xl border p-4.5 transition-all shadow-xs ${
                        isRegistered
                          ? 'border-emerald-300 ring-1 ring-emerald-300 bg-emerald-50/20'
                          : eligibility.eligible
                          ? 'border-slate-200 hover:border-emerald-300'
                          : 'border-slate-200 bg-slate-50/60 opacity-90'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          {/* Course Code & Credits */}
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                              {course.code}
                            </span>
                            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                              {course.credits} Credit Hours
                            </span>
                            <span className="text-xs text-slate-500">
                              Level {course.level} · {course.department}
                            </span>
                          </div>

                          {/* Titles */}
                          <h3 className="text-sm font-bold text-slate-900">
                            {course.nameEn}
                          </h3>
                          <p className="text-xs text-slate-500 font-arabic mb-2" dir="rtl">
                            {course.nameAr}
                          </p>

                          {/* Prerequisites & Schedule */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 mt-2">
                            {/* Prerequisites */}
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-slate-500">Prereq (المتطلب):</span>
                              {course.prerequisites.length === 0 ? (
                                <span className="text-slate-400">None</span>
                              ) : (
                                course.prerequisites.map((pre) => {
                                  const passed = student.transcript.find((t) => t.courseCode === pre && t.passed);
                                  return (
                                    <span
                                      key={pre}
                                      className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-medium ${
                                        passed
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : 'bg-rose-100 text-rose-800 font-bold'
                                      }`}
                                      title={passed ? 'Prerequisite passed' : 'Prerequisite NOT passed'}
                                    >
                                      {pre} {passed ? '✓' : '✗'}
                                    </span>
                                  );
                                })
                              )}
                            </div>

                            {/* Schedule */}
                            <div className="flex items-center gap-1 text-slate-500">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{course.schedule.day} {course.schedule.time}</span>
                            </div>

                            <div className="flex items-center gap-1 text-slate-500">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{course.schedule.room}</span>
                            </div>
                          </div>

                          {/* Capacity status */}
                          <div className="mt-2.5 flex items-center gap-2 max-w-xs">
                            <div className="text-[11px] text-slate-500 font-mono">
                              Seats: {course.enrolled}/{course.capacity}
                            </div>
                            <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  isFull
                                    ? 'bg-rose-500'
                                    : capacityPercent > 80
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(100, capacityPercent)}%` }}
                              ></div>
                            </div>
                            {isFull && (
                              <span className="text-[10px] font-bold text-rose-600 uppercase">
                                Full
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="shrink-0 flex sm:flex-col items-end justify-center">
                          {isRegistered ? (
                            <button
                              onClick={() => dropCourse(student.id, course.id)}
                              className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Drop Course</span>
                            </button>
                          ) : eligibility.status === 'passed' ? (
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Already Passed</span>
                            </span>
                          ) : eligibility.status === 'prereq_missing' ? (
                            <button
                              disabled
                              className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg opacity-80 cursor-not-allowed flex items-center gap-1"
                              title={eligibility.reason}
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Prereq Missing</span>
                            </button>
                          ) : eligibility.status === 'full' ? (
                            <button
                              disabled
                              className="px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed"
                            >
                              Class Full
                            </button>
                          ) : eligibility.status === 'credit_limit' ? (
                            <button
                              disabled
                              className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg cursor-not-allowed"
                              title="Exceeds maximum permitted credit hours"
                            >
                              Exceeds Cap
                            </button>
                          ) : (
                            <button
                              onClick={() => registerCourse(student.id, course.id)}
                              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Course</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Registration Cart & Advisor Status (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Registration Cart (بطاقة التسجيل)
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {currentRegisteredCredits} Cr Total
                </span>
              </div>

              {/* Status Indicator */}
              <div className="mt-3 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-between bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Submission Status:</span>
                <span
                  className={`font-semibold capitalize ${
                    student.registrationStatus === 'approved'
                      ? 'text-emerald-700'
                      : student.registrationStatus === 'pending_advisor'
                      ? 'text-blue-700'
                      : student.registrationStatus === 'rejected'
                      ? 'text-rose-700'
                      : 'text-slate-700'
                  }`}
                >
                  {student.registrationStatus === 'pending_advisor'
                    ? 'Pending Advisor Review'
                    : student.registrationStatus === 'approved'
                    ? 'Approved by Advisor ✓'
                    : student.registrationStatus === 'rejected'
                    ? 'Rejected by Advisor ✗'
                    : 'Draft (Not Submitted)'}
                </span>
              </div>

              {/* Advisor Notes if present */}
              {student.advisorNotes && (
                <div className="mt-2.5 p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
                  <div className="font-semibold flex items-center gap-1 text-blue-800 mb-0.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Advisor Remark ({student.advisorName}):</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-blue-950">
                    "{student.advisorNotes}"
                  </p>
                </div>
              )}

              {/* Courses in cart */}
              <div className="mt-4 space-y-2 max-h-72 overflow-y-auto pr-1">
                {registeredCourses.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Your registration cart is empty.
                    <br />
                    Select eligible courses from the catalog.
                  </div>
                ) : (
                  registeredCourses.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                    >
                      <div>
                        <div className="font-mono font-bold text-slate-900">
                          {c.code}
                        </div>
                        <div className="text-[11px] text-slate-600 line-clamp-1">
                          {c.nameEn}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {c.schedule.day} · {c.credits} Cr
                        </div>
                      </div>
                      <button
                        onClick={() => dropCourse(student.id, c.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Bylaws Summary */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                <div className="flex justify-between">
                  <span>Minimum semester load:</span>
                  <span className="font-mono font-semibold">12 Cr</span>
                </div>
                <div className="flex justify-between">
                  <span>Your maximum credit cap:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {student.maxCreditsAllowed} Cr {isProbation ? '(Probation)' : '(Normal)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining capacity in load:</span>
                  <span className="font-mono font-semibold text-emerald-700">
                    {Math.max(0, student.maxCreditsAllowed - currentRegisteredCredits)} Cr
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-4">
                <button
                  onClick={() => submitRegistrationCart(student.id)}
                  disabled={currentRegisteredCredits < 12 || currentRegisteredCredits > student.maxCreditsAllowed}
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs ${
                    currentRegisteredCredits >= 12 && currentRegisteredCredits <= student.maxCreditsAllowed
                      ? 'bg-emerald-800 hover:bg-emerald-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Cart to Academic Advisor</span>
                </button>
                {currentRegisteredCredits < 12 && (
                  <p className="text-[10px] text-amber-700 text-center mt-1.5 font-medium">
                    ⚠️ You need {12 - currentRegisteredCredits} more credit hours to meet the minimum 12-hour bylaw limit.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Academic Transcript Tab */}
      {activeTab === 'transcript' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div>
              <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Official Academic Record · كشف الدرجات المعتمد
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Ain Shams University · Faculty of Science Academic Transcript
              </h2>
              <p className="text-xs text-slate-500 font-arabic" dir="rtl">
                السجل الأكاديمي الرسمي لنظام الساعات المعتمدة
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Transcript Slip</span>
            </button>
          </div>

          {/* Transcript Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <div className="text-slate-500">Student Name:</div>
              <div className="font-bold text-slate-900">{student.nameEn}</div>
            </div>
            <div>
              <div className="text-slate-500">Academic ID:</div>
              <div className="font-mono font-bold text-slate-900">{student.id}</div>
            </div>
            <div>
              <div className="text-slate-500">Cumulative GPA (CGPA):</div>
              <div className="font-mono font-bold text-emerald-800 text-sm">
                {student.cgpa.toFixed(2)} / 4.00
              </div>
            </div>
            <div>
              <div className="text-slate-500">Total Credits Earned:</div>
              <div className="font-mono font-bold text-slate-900 text-sm">
                {student.completedCredits} Hours
              </div>
            </div>
          </div>

          {/* Semester Records */}
          <div className="space-y-6">
            {/* Group entries by semesterName */}
            {Array.from(new Set(student.transcript.map((t) => t.semesterName))).map((semName) => {
              const semEntries = student.transcript.filter((t) => t.semesterName === semName);
              const semCredits = semEntries.reduce((acc, e) => acc + e.credits, 0);
              const semQualityScore = semEntries.reduce((acc, e) => acc + e.qualityPoints * e.credits, 0);
              const semGpa = semCredits > 0 ? (semQualityScore / semCredits).toFixed(2) : '0.00';

              return (
                <div key={semName} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100/80 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-emerald-700" />
                      {semName}
                    </span>
                    <div className="flex items-center gap-4 text-slate-600">
                      <span>Attempted: <strong className="font-mono">{semCredits} Cr</strong></span>
                      <span>Semester GPA (SGPA): <strong className="font-mono text-emerald-800 font-bold">{semGpa}</strong></span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold">Course Code</th>
                          <th className="py-2.5 px-4 font-semibold">Course Title</th>
                          <th className="py-2.5 px-4 font-semibold text-center">Credit Hours</th>
                          <th className="py-2.5 px-4 font-semibold text-center">Letter Grade</th>
                          <th className="py-2.5 px-4 font-semibold text-center">Quality Points</th>
                          <th className="py-2.5 px-4 font-semibold text-center">Score %</th>
                          <th className="py-2.5 px-4 font-semibold text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {semEntries.map((entry, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-2 px-4 font-mono font-bold text-slate-900">
                              {entry.courseCode}
                            </td>
                            <td className="py-2 px-4">
                              <div className="font-medium text-slate-800">{entry.courseNameEn}</div>
                              <div className="text-[10px] text-slate-400 font-arabic">{entry.courseNameAr}</div>
                            </td>
                            <td className="py-2 px-4 text-center font-mono">{entry.credits}</td>
                            <td className="py-2 px-4 text-center">
                              <span
                                className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                                  entry.letterGrade === 'F'
                                    ? 'bg-rose-100 text-rose-800'
                                    : entry.letterGrade.startsWith('A')
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-800'
                                }`}
                              >
                                {entry.letterGrade}
                              </span>
                            </td>
                            <td className="py-2 px-4 text-center font-mono tabular-nums text-slate-700">
                              {entry.qualityPoints.toFixed(1)}
                            </td>
                            <td className="py-2 px-4 text-center font-mono text-slate-600">
                              {entry.numericScore ? `${entry.numericScore}%` : '-'}
                            </td>
                            <td className="py-2 px-4 text-center">
                              {entry.passed ? (
                                <span className="text-[11px] font-semibold text-emerald-700">
                                  Passed (ناجح)
                                </span>
                              ) : (
                                <span className="text-[11px] font-bold text-rose-700">
                                  Failed (راسب - يجب الإعادة)
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Weekly Timetable Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Weekly Lecture & Laboratory Timetable (الجدول الدراسي الأسبوعي)
              </h2>
              <p className="text-xs text-slate-500">
                Ain Shams Academic Week: Sunday through Thursday
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Schedule</span>
            </button>
          </div>

          {registeredCourses.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No registered courses in your schedule yet. Add courses in the Registration tab.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[700px] border border-slate-200 rounded-xl overflow-hidden">
                {/* Header Days */}
                <div className="grid grid-cols-5 bg-emerald-900 text-white text-xs font-semibold text-center divide-x divide-emerald-800">
                  <div className="py-2.5">Sunday (الأحد)</div>
                  <div className="py-2.5">Monday (الإثنين)</div>
                  <div className="py-2.5">Tuesday (الثلاثاء)</div>
                  <div className="py-2.5">Wednesday (الأربعاء)</div>
                  <div className="py-2.5">Thursday (الخميس)</div>
                </div>

                {/* Days Columns */}
                <div className="grid grid-cols-5 min-h-[360px] divide-x divide-slate-200 bg-slate-50">
                  {(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'] as const).map((day) => {
                    const dayCourses = registeredCourses.filter((c) => c.schedule.day === day);
                    return (
                      <div key={day} className="p-2 space-y-2">
                        {dayCourses.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-[11px] text-slate-300">
                            No classes
                          </div>
                        ) : (
                          dayCourses.map((c) => (
                            <div
                              key={c.id}
                              className="bg-white p-2.5 rounded-lg border border-emerald-200 shadow-xs text-xs hover:border-emerald-400 transition-colors"
                            >
                              <div className="font-mono font-bold text-emerald-900">
                                {c.code}
                              </div>
                              <div className="font-medium text-slate-800 line-clamp-2 text-[11px] mt-0.5">
                                {c.nameEn}
                              </div>
                              <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500 space-y-0.5">
                                <div className="flex items-center gap-1 font-mono text-slate-700">
                                  <Clock className="w-3 h-3 text-emerald-600" />
                                  <span>{c.schedule.time}</span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-600">
                                  <MapPin className="w-3 h-3 text-emerald-600" />
                                  <span>{c.schedule.room}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
