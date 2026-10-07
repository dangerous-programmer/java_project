import React, { useState } from 'react';
import { useSis } from '../context/SisContext';
import { Course, Student, LetterGrade } from '../types';
import { scoreToLetterGrade, GRADE_POINTS } from '../mockData';
import {
  UserCheck,
  BookOpen,
  Award,
  Save,
  Users,
  CheckCircle,
  FileSpreadsheet,
  BarChart3,
  Search
} from 'lucide-react';

export const InstructorPortal: React.FC = () => {
  const { courses, students, publishGrade } = useSis();

  // Filter courses taught by Dr. Nadia Mostafa or any instructor
  const instructorCourses = courses.filter((c) => c.instructorId === 'INS-402' || c.department === 'Computer Science');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(instructorCourses[0]?.id || 'COMP201');

  // Local draft scores state: studentId -> { coursework: number, finalExam: number }
  const [draftGrades, setDraftGrades] = useState<Record<string, { coursework: number; finalExam: number }>>({
    '2201045': { coursework: 36, finalExam: 54 }, // Total 90 -> A
    '2201890': { coursework: 22, finalExam: 31 }, // Total 53 -> D+
    '2202110': { coursework: 30, finalExam: 45 }, // Total 75 -> B
  });

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Find enrolled students in this course (either currently registered or in draft)
  const enrolledStudents = students.filter((s) => {
    return s.currentRegistration.some((r) => r.courseId === selectedCourse.id);
  });

  // If no one enrolled currently in mock, fallback to showing all departmental students for grade entry demo
  const studentsToGrade = enrolledStudents.length > 0 ? enrolledStudents : students;

  const handleScoreChange = (studentId: string, field: 'coursework' | 'finalExam', value: string) => {
    const num = Math.max(0, Math.min(field === 'coursework' ? 40 : 60, Number(value) || 0));
    setDraftGrades((prev) => ({
      ...prev,
      [studentId]: {
        coursework: field === 'coursework' ? num : prev[studentId]?.coursework || 0,
        finalExam: field === 'finalExam' ? num : prev[studentId]?.finalExam || 0,
      },
    }));
  };

  const handleSaveGrade = (studentId: string) => {
    const grades = draftGrades[studentId] || { coursework: 0, finalExam: 0 };
    publishGrade(studentId, selectedCourse.id, grades.coursework, grades.finalExam);
  };

  const handleSaveAll = () => {
    studentsToGrade.forEach((s) => {
      const grades = draftGrades[s.id] || { coursework: 0, finalExam: 0 };
      publishGrade(s.id, selectedCourse.id, grades.coursework, grades.finalExam);
    });
  };

  // Compute Grade distribution
  const gradeDistribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  studentsToGrade.forEach((s) => {
    const grades = draftGrades[s.id] || { coursework: 0, finalExam: 0 };
    const total = grades.coursework + grades.finalExam;
    const letter = scoreToLetterGrade(total);
    if (letter.startsWith('A')) gradeDistribution.A++;
    else if (letter.startsWith('B')) gradeDistribution.B++;
    else if (letter.startsWith('C')) gradeDistribution.C++;
    else if (letter.startsWith('D')) gradeDistribution.D++;
    else gradeDistribution.F++;
  });

  return (
    <div className="space-y-6">
      {/* Instructor Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
              Course Instructor Portal · بوابة أستاذ المقرر
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Dr. Nadia Mostafa · Professor of Computer Science
            </h1>
            <p className="text-xs text-slate-500 font-arabic" dir="rtl">
              رصد أعمال الفصل والامتحان النهائي لمقررات قسم علوم الحاسب
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700">Select Assigned Course:</span>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="text-xs font-mono font-bold border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {instructorCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.nameEn} ({c.credits} Cr)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Course Stats & Grade Distribution Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Active Course</div>
            <div className="font-bold text-slate-900 text-sm">
              {selectedCourse.code} · {selectedCourse.credits} Credit Hours
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Enrolled Students</div>
            <div className="font-bold text-slate-900 text-sm">
              {studentsToGrade.length} Students on Roster
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-slate-500 mb-1">Live Grade Distribution</div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className="text-emerald-700 font-bold">A: {gradeDistribution.A}</span>
              <span>·</span>
              <span className="text-blue-700 font-bold">B: {gradeDistribution.B}</span>
              <span>·</span>
              <span className="text-slate-700 font-bold">C: {gradeDistribution.C}</span>
              <span>·</span>
              <span className="text-amber-700 font-bold">D: {gradeDistribution.D}</span>
              <span>·</span>
              <span className="text-rose-700 font-bold">F: {gradeDistribution.F}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Entry Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-purple-700" />
              <span>Official Grade Sheet & Coursework Entry (كشف درجات المقرر)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Ain Shams Science Standard: Coursework /40 (Midterms/Practical) + Final Exam /60 = Total /100
            </p>
          </div>

          <button
            onClick={handleSaveAll}
            className="px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Publish All Grades (اعتماد وترحيل الدرجات)</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Student ID</th>
                <th className="py-3 px-4 font-semibold">Student Name</th>
                <th className="py-3 px-4 font-semibold">Major & Standing</th>
                <th className="py-3 px-4 font-semibold text-center w-32">Coursework (/40)</th>
                <th className="py-3 px-4 font-semibold text-center w-32">Final Exam (/60)</th>
                <th className="py-3 px-4 font-semibold text-center w-24">Total (/100)</th>
                <th className="py-3 px-4 font-semibold text-center w-24">Letter Grade</th>
                <th className="py-3 px-4 font-semibold text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentsToGrade.map((student) => {
                const draft = draftGrades[student.id] || { coursework: 0, finalExam: 0 };
                const total = draft.coursework + draft.finalExam;
                const letter = scoreToLetterGrade(total);
                const qp = GRADE_POINTS[letter];

                // Check if student already has a recorded grade in transcript
                const transcriptEntry = student.transcript.find(
                  (t) => t.courseId === selectedCourse.id || t.courseCode === selectedCourse.code
                );

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {student.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{student.nameEn}</div>
                      <div className="text-[10px] text-slate-500 font-arabic">{student.nameAr}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-700">{student.major}</div>
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                          student.standing === 'PROBATION'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {student.standing === 'PROBATION' ? 'Probation' : 'Good Standing'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="40"
                        value={draft.coursework}
                        onChange={(e) => handleScoreChange(student.id, 'coursework', e.target.value)}
                        className="w-20 text-center font-mono font-bold py-1 px-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={draft.finalExam}
                        onChange={(e) => handleScoreChange(student.id, 'finalExam', e.target.value)}
                        className="w-20 text-center font-mono font-bold py-1 px-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-sm text-slate-900 tabular-nums">
                      {total}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          letter === 'F'
                            ? 'bg-rose-100 text-rose-800'
                            : letter.startsWith('A')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {letter} ({qp.toFixed(1)})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleSaveGrade(student.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md border border-purple-200 transition-colors"
                        title="Record score to student transcript and re-calculate CGPA"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
