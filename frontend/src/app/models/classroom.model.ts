import { Term } from './term.model';
import { Teacher } from './teacher.model';
import { Student } from './student.model';

export interface Classroom {
  id: number;
  name: string;
  gradeSection: string;
  subject: string;
  roomNumber: string;
  term: Term;
  teacherCount: number;
  studentCount: number;
  teachers: Teacher[];
  students: Student[];
}

export interface ClassroomRequest {
  name: string;
  gradeSection: string;
  subject: string;
  roomNumber: string;
  termId: number;
}

export interface TeacherDashboardResponse {
  currentTermClassrooms: Classroom[];
  previousTermClassrooms: Classroom[];
  futureTermClassrooms: Classroom[];
}
