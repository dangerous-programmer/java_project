import React, { useState } from 'react';
import { useSis } from '../context/SisContext';
import { Course } from '../types';
import { DEPARTMENTS } from '../mockData';
import {
  ShieldAlert,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  BarChart2,
  Users,
  Settings,
  X,
  CheckCircle,
  Database,
  Building
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { courses, students, addCourse, deleteCourse, updateCourse } = useSis();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // New course form state
  const [newCode, setNewCode] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newNameAr, setNewNameAr] = useState('');
  const [newDept, setNewDept] = useState(DEPARTMENTS[0]);
  const [newCredits, setNewCredits] = useState<number>(3);
  const [newLevel, setNewLevel] = useState<1 | 2 | 3 | 4>(2);
  const [newCapacity, setNewCapacity] = useState<number>(50);
  const [newPrereqs, setNewPrereqs] = useState<string[]>([]);
  const [newDay, setNewDay] = useState<'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday'>('Sunday');
  const [newTime, setNewTime] = useState('10:30 - 12:30');
  const [newRoom, setNewRoom] = useState('Hall 305');

  // Statistics
  const totalCourses = courses.length;
  const totalSeats = courses.reduce((sum, c) => sum + c.capacity, 0);
  const totalEnrolled = courses.reduce((sum, c) => sum + c.enrolled, 0);
  const occupancyRate = totalSeats > 0 ? Math.round((totalEnrolled / totalSeats) * 100) : 0;
  const probationCount = students.filter((s) => s.standing === 'PROBATION').length;
  const probationPercentage = students.length > 0 ? Math.round((probationCount / students.length) * 100) : 0;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newNameEn) return;

    addCourse({
      code: newCode.toUpperCase().trim(),
      nameEn: newNameEn.trim(),
      nameAr: newNameAr.trim() || newNameEn.trim(),
      department: newDept,
      credits: newCredits,
      level: newLevel,
      semester: 1,
      capacity: newCapacity,
      prerequisites: newPrereqs,
      instructorId: 'INS-402',
      instructorName: 'Faculty of Science Staff',
      schedule: {
        day: newDay,
        time: newTime,
        room: newRoom,
      },
    });

    // Reset form
    setNewCode('');
    setNewNameEn('');
    setNewNameAr('');
    setNewPrereqs([]);
    setIsAddModalOpen(false);
  };

  const togglePrereq = (code: string) => {
    setNewPrereqs((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
              System Administration · إدارة نظام الساعات المعتمدة
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Eng. Tarek Mansour · SIS Administrator
            </h1>
            <p className="text-xs text-slate-500 font-arabic" dir="rtl">
              إدارة دليل المقررات الأكاديمية وضبط السعة الاستيعابية والمتطلبات السابقة
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Course (إضافة مقرر جديد)</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Offered Courses</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {totalCourses}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across 5 Departments</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Enrollment</div>
          <div className="text-2xl font-bold font-mono text-emerald-800 mt-1 tabular-nums">
            {totalEnrolled} / {totalSeats}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{occupancyRate}% Overall Utilization</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Probation Rate</div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1 tabular-nums">
            {probationPercentage}%
          </div>
          <div className="text-[11px] text-amber-800 mt-0.5">{probationCount} Students Capped at 12 Cr</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Bylaws Status</div>
          <div className="text-base font-bold text-slate-800 mt-1 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Active Enforced</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Prereq & Credit Caps Strict</div>
        </div>
      </div>

      {/* Course Catalog Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-700" />
              <span>Official Academic Course Catalog (دليل المقررات الدراسية)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Manage credit hours, prerequisites, and maximum capacity caps
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-500">
            {courses.length} Active Courses
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Code</th>
                <th className="py-3 px-4 font-semibold">Course Title</th>
                <th className="py-3 px-4 font-semibold">Department</th>
                <th className="py-3 px-4 font-semibold text-center">Level</th>
                <th className="py-3 px-4 font-semibold text-center">Credits</th>
                <th className="py-3 px-4 font-semibold">Prerequisites</th>
                <th className="py-3 px-4 font-semibold text-center">Capacity</th>
                <th className="py-3 px-4 font-semibold">Schedule</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((course) => {
                const isFull = course.enrolled >= course.capacity;

                return (
                  <tr key={course.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {course.code}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{course.nameEn}</div>
                      <div className="text-[10px] text-slate-400 font-arabic">{course.nameAr}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{course.department}</td>
                    <td className="py-3 px-4 text-center font-mono">L{course.level}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-800">
                      {course.credits} Cr
                    </td>
                    <td className="py-3 px-4">
                      {course.prerequisites.length === 0 ? (
                        <span className="text-slate-400 text-[11px]">None</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {course.prerequisites.map((p) => (
                            <span
                              key={p}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="font-mono tabular-nums">
                        <span className={isFull ? 'text-rose-700 font-bold' : 'text-slate-800'}>
                          {course.enrolled}
                        </span>{' '}
                        / {course.capacity}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {course.schedule.day} {course.schedule.time}
                      <div className="text-[10px] text-slate-400">{course.schedule.room}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete course from catalog"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Course Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-slate-200">
            <div className="bg-emerald-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Course to Faculty Catalog</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Course Code (e.g. COMP305)
                  </label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="COMP305"
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono uppercase focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Course Name (English)
                </label>
                <input
                  type="text"
                  required
                  value={newNameEn}
                  onChange={(e) => setNewNameEn(e.target.value)}
                  placeholder="Software Engineering"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Course Name (Arabic)
                </label>
                <input
                  type="text"
                  value={newNameAr}
                  onChange={(e) => setNewNameAr(e.target.value)}
                  placeholder="هندسة البرمجيات"
                  dir="rtl"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 font-arabic"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Credit Hours
                  </label>
                  <select
                    value={newCredits}
                    onChange={(e) => setNewCredits(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  >
                    <option value={2}>2 Credits</option>
                    <option value={3}>3 Credits</option>
                    <option value={4}>4 Credits</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Academic Level
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(Number(e.target.value) as 1 | 2 | 3 | 4)}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  >
                    <option value={1}>Level 1</option>
                    <option value={2}>Level 2</option>
                    <option value={3}>Level 3</option>
                    <option value={4}>Level 4</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Capacity (Seats)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Prerequisites (Select required courses):
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg max-h-24 overflow-y-auto">
                  {courses.map((c) => {
                    const isSelected = newPrereqs.includes(c.code);
                    return (
                      <button
                        type="button"
                        key={c.code}
                        onClick={() => togglePrereq(c.code)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                          isSelected
                            ? 'bg-emerald-700 text-white font-bold'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {c.code} {isSelected ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Day</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room / Hall</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save Course to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
