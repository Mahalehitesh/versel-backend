export interface Student {
  id: number;
  rollNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  grade: string;
  contactEmail?: string;
  contactPhone?: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  enrollmentDate: string;
  notes?: string;
}

export interface ClassroomSummary {
  id: number;
  name: string;
  gradeSection: string;
  subject: string;
  roomNumber: string;
  termName: string;
  termStatus: string;
}

export interface StudentDetail extends Student {
  classrooms: ClassroomSummary[];
}

export interface StudentRequest {
  rollNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  grade: string;
  contactEmail?: string;
  contactPhone?: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  enrollmentDate: string;
  notes?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
