import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Student, StaffMember, UserRole, LetterGrade, TranscriptEntry } from '../types';
import { INITIAL_COURSES, INITIAL_STUDENTS, INITIAL_STAFF, calculateGPA, scoreToLetterGrade, GRADE_POINTS } from '../mockData';

interface ToastMessage {
  id: string;
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
}

interface SisContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  currentUser: Student | StaffMember | null;
  currentRole: UserRole | null;
  courses: Course[];
  students: Student[];
  staff: StaffMember[];
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  login: (id: string, pin: string) => boolean;
  logout: () => void;
  switchRoleQuick: (role: UserRole, accountId?: string) => void;
  resetSimulationData: () => void;
  // Student Actions
  registerCourse: (studentId: string, courseId: string) => { success: boolean; error?: string };
  dropCourse: (studentId: string, courseId: string) => void;
  submitRegistrationCart: (studentId: string) => void;
  // Advisor Actions
  reviewRegistration: (studentId: string, decision: 'approved' | 'rejected', notes: string) => void;
  // Instructor Actions
  publishGrade: (studentId: string, courseId: string, coursework: number, finalExam: number) => void;
  // Admin Actions
  addCourse: (courseData: Omit<Course, 'id' | 'enrolled'>) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
}

const SisContext = createContext<SisContextType | undefined>(undefined);

const STORAGE_KEY = 'asu_sci_sis_state_v1';

export const SisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_courses`);
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [staff] = useState<StaffMember[]>(INITIAL_STAFF);

  // Default to Student 1 (Ziad Mohamed, Normal CS) for instant testing & zero blank state
  const [currentUser, setCurrentUser] = useState<Student | StaffMember | null>(() => {
    const savedId = localStorage.getItem(`${STORAGE_KEY}_userId`);
    if (savedId) {
      const foundStudent = INITIAL_STUDENTS.find((s) => s.id === savedId);
      if (foundStudent) return foundStudent;
      const foundStaff = INITIAL_STAFF.find((st) => st.id === savedId);
      if (foundStaff) return foundStaff;
    }
    return INITIAL_STUDENTS[0];
  });

  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => {
    const savedRole = localStorage.getItem(`${STORAGE_KEY}_role`);
    return (savedRole as UserRole) || 'student';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_courses`, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_userId`, currentUser.id);
    }
    if (currentRole) {
      localStorage.setItem(`${STORAGE_KEY}_role`, currentRole);
    }
  }, [currentUser, currentRole]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = (id: string, pin: string): boolean => {
    const cleanId = id.trim();
    const cleanPin = pin.trim();

    // Check students
    const student = students.find((s) => s.id.toLowerCase() === cleanId.toLowerCase() && s.pin === cleanPin);
    if (student) {
      setCurrentUser(student);
      setCurrentRole('student');
      addToast('success', 'Authentication Successful', `Welcome, ${student.nameEn} (${student.nameAr})`);
      return true;
    }

    // Check staff
    const staffMember = staff.find((st) => st.id.toLowerCase() === cleanId.toLowerCase() && st.pin === cleanPin);
    if (staffMember) {
      setCurrentUser(staffMember);
      setCurrentRole(staffMember.role);
      addToast('success', 'Staff Login Verified', `Welcome ${staffMember.title} - ${staffMember.nameEn}`);
      return true;
    }

    addToast('error', 'Authentication Failed', 'Invalid Academic ID or 4-digit PIN code. Please verify credentials.');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    localStorage.removeItem(`${STORAGE_KEY}_userId`);
    localStorage.removeItem(`${STORAGE_KEY}_role`);
    addToast('info', 'Logged Out', 'You have securely signed out of Ain Shams University SIS.');
  };

  const switchRoleQuick = (role: UserRole, accountId?: string) => {
    if (role === 'student') {
      const targetStudent = accountId
        ? students.find((s) => s.id === accountId) || students[0]
        : students[0];
      setCurrentUser(targetStudent);
      setCurrentRole('student');
      addToast('info', 'Switched to Student Role', `Logged in as ${targetStudent.nameEn} (${targetStudent.standing === 'PROBATION' ? 'Academic Probation' : 'Good Standing'})`);
    } else if (role === 'advisor') {
      const advisor = staff.find((st) => st.role === 'advisor')!;
      setCurrentUser(advisor);
      setCurrentRole('advisor');
      addToast('info', 'Switched to Academic Advisor', `Logged in as ${advisor.nameEn}`);
    } else if (role === 'instructor') {
      const instructor = staff.find((st) => st.role === 'instructor')!;
      setCurrentUser(instructor);
      setCurrentRole('instructor');
      addToast('info', 'Switched to Course Instructor', `Logged in as ${instructor.nameEn}`);
    } else if (role === 'admin') {
      const admin = staff.find((st) => st.role === 'admin')!;
      setCurrentUser(admin);
      setCurrentRole('admin');
      addToast('info', 'Switched to System Administrator', `Logged in as ${admin.nameEn}`);
    }
  };

  const resetSimulationData = () => {
    setCourses(INITIAL_COURSES);
    setStudents(INITIAL_STUDENTS);
    setCurrentUser(INITIAL_STUDENTS[0]);
    setCurrentRole('student');
    localStorage.removeItem(`${STORAGE_KEY}_courses`);
    localStorage.removeItem(`${STORAGE_KEY}_students`);
    localStorage.removeItem(`${STORAGE_KEY}_userId`);
    localStorage.removeItem(`${STORAGE_KEY}_role`);
    addToast('success', 'System Reset', 'All course catalogs, registrations, and student records have been reset to default bylaws state.');
  };

  // Student registration logic with full Credit Hour Bylaw checks
  const registerCourse = (studentId: string, courseId: string): { success: boolean; error?: string } => {
    const student = students.find((s) => s.id === studentId);
    const course = courses.find((c) => c.id === courseId);

    if (!student || !course) {
      return { success: false, error: 'Student or Course not found.' };
    }

    // 1. Capacity Check
    if (course.enrolled >= course.capacity) {
      const msg = `Course ${course.code} has reached its maximum enrollment capacity (${course.enrolled}/${course.capacity}).`;
      addToast('error', 'Course Capacity Full / المقرر مكتمل', msg);
      return { success: false, error: msg };
    }

    // 2. Already Registered Check (in current registration)
    const isAlreadyInCart = student.currentRegistration.some((r) => r.courseId === course.id);
    if (isAlreadyInCart) {
      const msg = `You are already enrolled or registered in ${course.code}. Duplicate registration is prohibited.`;
      addToast('warning', 'Already Registered / مسجل مسبقاً', msg);
      return { success: false, error: msg };
    }

    // 3. Already Passed in Previous Semester Check (no retake unless failed)
    const passedInTranscript = student.transcript.find(
      (t) => (t.courseId === course.id || t.courseCode === course.code) && t.passed
    );
    if (passedInTranscript) {
      const msg = `Course ${course.code} has already been passed in ${passedInTranscript.semesterName} with grade ${passedInTranscript.letterGrade}. Retake of passed courses requires special dean approval.`;
      addToast('warning', 'Course Already Passed / تم اجتياز المقرر', msg);
      return { success: false, error: msg };
    }

    // 4. Prerequisite Check (Must have passed all prerequisites)
    if (course.prerequisites && course.prerequisites.length > 0) {
      for (const prereqCode of course.prerequisites) {
        const passedPrereq = student.transcript.find(
          (t) => t.courseCode === prereqCode && t.passed
        );
        if (!passedPrereq) {
          const prereqCourse = courses.find((c) => c.code === prereqCode);
          const prereqTitle = prereqCourse ? prereqCourse.nameEn : prereqCode;
          const msg = `Academic Bylaw Restriction: Prerequisite ${prereqCode} (${prereqTitle}) has not been passed. You must pass all prerequisite courses before enrolling.`;
          addToast('error', 'Prerequisite Not Met / المتطلب السابق غير مستوفى', msg);
          return { success: false, error: msg };
        }
      }
    }

    // 5. Credit Hour Limit Check
    // Calculate current registered credits in cart
    const currentCredits = student.currentRegistration.reduce((sum, reg) => {
      const c = courses.find((crs) => crs.id === reg.courseId);
      return sum + (c ? c.credits : 0);
    }, 0);

    const projectedCredits = currentCredits + course.credits;

    if (projectedCredits > student.maxCreditsAllowed) {
      const isProbation = student.standing === 'PROBATION';
      const msg = isProbation
        ? `Academic Probation Violation: Your CGPA is ${student.cgpa.toFixed(2)} (< 2.00). According to Ain Shams bylaws, students on probation are capped at exactly 12 credit hours. Current: ${currentCredits} Cr + New: ${course.credits} Cr = ${projectedCredits} Cr.`
        : `Credit Hour Cap Exceeded: Maximum semester load for regular students is ${student.maxCreditsAllowed} credit hours. Projected load would be ${projectedCredits} Cr.`;

      addToast('error', 'Credit Limit Exceeded / تجاوز الحد الأقصى للساعات', msg);
      return { success: false, error: msg };
    }

    // All bylaws checks passed! Add to registration
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            currentRegistration: [
              ...s.currentRegistration,
              { courseId: course.id, status: 'draft', registeredAt: new Date().toISOString().split('T')[0] },
            ],
            registrationStatus: 'draft',
          };
        }
        return s;
      })
    );

    // Increment enrolled count
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          return { ...c, enrolled: c.enrolled + 1 };
        }
        return c;
      })
    );

    // Update currentUser if matching
    if (currentUser && currentUser.id === studentId) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        const s = prev as Student;
        return {
          ...s,
          currentRegistration: [
            ...s.currentRegistration,
            { courseId: course.id, status: 'draft', registeredAt: new Date().toISOString().split('T')[0] },
          ],
          registrationStatus: 'draft',
        };
      });
    }

    addToast('success', 'Course Added to Registration / تمت إضافة المقرر', `${course.code} - ${course.nameEn} (${course.credits} Cr) registered successfully.`);
    return { success: true };
  };

  const dropCourse = (studentId: string, courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            currentRegistration: s.currentRegistration.filter((r) => r.courseId !== courseId),
            registrationStatus: 'draft',
          };
        }
        return s;
      })
    );

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          return { ...c, enrolled: Math.max(0, c.enrolled - 1) };
        }
        return c;
      })
    );

    if (currentUser && currentUser.id === studentId) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        const s = prev as Student;
        return {
          ...s,
          currentRegistration: s.currentRegistration.filter((r) => r.courseId !== courseId),
          registrationStatus: 'draft',
        };
      });
    }

    addToast('info', 'Course Dropped / تم حذف المقرر', `${course ? course.code : 'Course'} has been removed from your registration.`);
  };

  const submitRegistrationCart = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    // Check minimum credit limit (12 credits)
    const currentCredits = student.currentRegistration.reduce((sum, reg) => {
      const c = courses.find((crs) => crs.id === reg.courseId);
      return sum + (c ? c.credits : 0);
    }, 0);

    if (currentCredits < 12) {
      addToast(
        'error',
        'Minimum Credit Hours Required / الحد الأدنى للتسجيل 12 ساعة',
        `Ain Shams University bylaws mandate a minimum registration load of 12 credit hours. Your current cart has only ${currentCredits} credit hours.`
      );
      return;
    }

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            registrationStatus: 'pending_advisor',
            currentRegistration: s.currentRegistration.map((r) => ({ ...r, status: 'pending_advisor' })),
          };
        }
        return s;
      })
    );

    if (currentUser && currentUser.id === studentId) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        const s = prev as Student;
        return {
          ...s,
          registrationStatus: 'pending_advisor',
          currentRegistration: s.currentRegistration.map((r) => ({ ...r, status: 'pending_advisor' })),
        };
      });
    }

    addToast('success', 'Registration Submitted / تم إرسال طلب التسجيل', `Your schedule (${currentCredits} Credit Hours) was submitted to Academic Advisor ${student.advisorName} for review.`);
  };

  const reviewRegistration = (studentId: string, decision: 'approved' | 'rejected', notes: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            registrationStatus: decision,
            advisorNotes: notes,
            currentRegistration: s.currentRegistration.map((r) => ({ ...r, status: decision })),
          };
        }
        return s;
      })
    );

    if (currentUser && currentUser.id === studentId) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        const s = prev as Student;
        return {
          ...s,
          registrationStatus: decision,
          advisorNotes: notes,
          currentRegistration: s.currentRegistration.map((r) => ({ ...r, status: decision })),
        };
      });
    }

    addToast(
      decision === 'approved' ? 'success' : 'warning',
      decision === 'approved' ? 'Registration Approved / اعتماد التسجيل' : 'Registration Rejected / رفض التسجيل',
      `Student #${studentId} registration was ${decision} with advisor remarks.`
    );
  };

  const publishGrade = (studentId: string, courseId: string, coursework: number, finalExam: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const total = coursework + finalExam;
    const letterGrade = scoreToLetterGrade(total);
    const qualityPoints = GRADE_POINTS[letterGrade];
    const passed = letterGrade !== 'F';

    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;

        const existingIdx = student.transcript.findIndex((t) => t.courseId === courseId || t.courseCode === course.code);
        let updatedTranscript: TranscriptEntry[];

        const newEntry: TranscriptEntry = {
          courseId: course.id,
          courseCode: course.code,
          courseNameEn: course.nameEn,
          courseNameAr: course.nameAr,
          credits: course.credits,
          semesterName: 'Spring 2025/2026',
          letterGrade,
          numericScore: total,
          qualityPoints,
          passed,
        };

        if (existingIdx >= 0) {
          updatedTranscript = [...student.transcript];
          updatedTranscript[existingIdx] = newEntry;
        } else {
          updatedTranscript = [...student.transcript, newEntry];
        }

        // Recompute GPA
        const { cgpa, earnedCredits } = calculateGPA(updatedTranscript);
        const isProbation = cgpa < 2.00;

        return {
          ...student,
          transcript: updatedTranscript,
          cgpa,
          completedCredits: earnedCredits,
          standing: isProbation ? 'PROBATION' : 'GOOD_STANDING',
          maxCreditsAllowed: isProbation ? 12 : 19,
        };
      })
    );

    addToast('success', 'Grade Published / رصد الدرجة بنجاح', `Recorded grade ${letterGrade} (${total}/100) for Student #${studentId} in ${course.code}. Student CGPA updated.`);
  };

  const addCourse = (courseData: Omit<Course, 'id' | 'enrolled'>) => {
    const id = courseData.code;
    const newCourse: Course = {
      ...courseData,
      id,
      enrolled: 0,
    };
    setCourses((prev) => [...prev, newCourse]);
    addToast('success', 'Course Created', `New course ${newCourse.code} (${newCourse.nameEn}) added to Faculty of Science catalog.`);
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, ...updates } : c))
    );
    addToast('success', 'Course Updated', `Course ${courseId} details updated.`);
  };

  const deleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    addToast('info', 'Course Removed', `Course ${courseId} removed from catalog.`);
  };

  return (
    <SisContext.Provider
      value={{
        language,
        setLanguage,
        currentUser,
        currentRole,
        courses,
        students,
        staff,
        toasts,
        addToast,
        removeToast,
        login,
        logout,
        switchRoleQuick,
        resetSimulationData,
        registerCourse,
        dropCourse,
        submitRegistrationCart,
        reviewRegistration,
        publishGrade,
        addCourse,
        updateCourse,
        deleteCourse,
      }}
    >
      {children}
    </SisContext.Provider>
  );
};

export const useSis = () => {
  const context = useContext(SisContext);
  if (!context) {
    throw new Error('useSis must be used within a SisProvider');
  }
  return context;
};
