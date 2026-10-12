export interface DepartureHistory {
  id: number;
  entityType: 'STUDENT' | 'TEACHER';
  originalId?: number;
  identifier: string; // Roll number or Employee ID
  fullName: string;
  email?: string;
  phone?: string;
  departmentOrGrade?: string; // Grade for student, Department for teacher
  gender?: string;
  dateOfBirth?: string;
  enrollmentOrJoiningDate?: string;
  departureDate: string;
  guardianInfo?: string;
  address?: string;
  notes?: string;
  previousClassrooms?: string;
  deletedBy?: string;
  createdAt?: string;
}

export interface HistoryCounts {
  students: number;
  teachers: number;
}
