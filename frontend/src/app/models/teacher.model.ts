export interface Teacher {
  id: number;
  userId: number;
  username: string;
  email: string;
  fullName: string;
  employeeId: string;
  department: string;
  phone: string;
}

export interface TeacherRequest {
  username: string;
  password?: string;
  email: string;
  fullName: string;
  employeeId: string;
  department?: string;
  phone?: string;
}
