export type AcademicStanding = 'GOOD_STANDING' | 'PROBATION';

export type UserRole = 'student' | 'advisor' | 'instructor' | 'admin';

export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'F' | 'IP'; // IP = In Progress

export interface Course {
  id: string;
  code: string; // e.g., COMP201
  nameEn: string;
  nameAr: string;
  credits: number; // usually 2 or 3
  department: string; // 'Computer Science', 'Mathematics', 'Statistics', 'Biophysics', 'Chemistry', 'General Science'
  level: 1 | 2 | 3 | 4;
  semester: 1 | 2;
  prerequisites: string[]; // Course codes required before registering
  capacity: number;
  enrolled: number;
  instructorId: string;
  instructorName: string;
  schedule: {
    day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
    time: string; // e.g. "09:00 - 11:00"
    room: string; // e.g. "Hall 302", "CS Lab 1"
  };
}

export interface TranscriptEntry {
  courseId: string;
  courseCode: string;
  courseNameEn: string;
  courseNameAr: string;
  credits: number;
  semesterName: string; // e.g., "Fall 2024", "Spring 2025"
  letterGrade: LetterGrade;
  numericScore?: number; // out of 100
  qualityPoints: number; // e.g., 4.0, 3.7
  passed: boolean;
}

export interface StudentRegistration {
  courseId: string;
  status: 'draft' | 'pending_advisor' | 'approved' | 'rejected';
  registeredAt: string;
}

export interface Student {
  id: string; // Student ID e.g., "2201045"
  pin: string; // 4-digit PIN
  nameEn: string;
  nameAr: string;
  email: string;
  major: string;
  level: 1 | 2 | 3 | 4;
  advisorId: string;
  advisorName: string;
  cgpa: number;
  standing: AcademicStanding;
  completedCredits: number;
  maxCreditsAllowed: number; // 19 for normal, 12 for probation
  transcript: TranscriptEntry[];
  currentRegistration: StudentRegistration[];
  advisorNotes?: string;
  registrationStatus: 'none' | 'draft' | 'pending_advisor' | 'approved' | 'rejected';
}

export interface StaffMember {
  id: string; // e.g., "ADV-301", "INS-402", "ADM-001"
  pin: string;
  nameEn: string;
  nameAr: string;
  role: 'advisor' | 'instructor' | 'admin';
  department: string;
  title: string;
  assignedCourses?: string[]; // For instructors
  assignedAdviseeIds?: string[]; // For advisors
}

export interface GradeInput {
  studentId: string;
  courseId: string;
  coursework: number; // /40
  finalExam: number; // /60
  total: number; // /100
  letterGrade: LetterGrade;
}
