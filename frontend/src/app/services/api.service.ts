import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Term, TermRequest } from '../models/term.model';
import { Teacher, TeacherRequest } from '../models/teacher.model';
import { Student, StudentDetail, StudentRequest, PageResponse } from '../models/student.model';
import { Classroom, ClassroomRequest, TeacherDashboardResponse } from '../models/classroom.model';
import { DepartureHistory, HistoryCounts } from '../models/history.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  // --- Terms ---
  getTerms(): Observable<Term[]> {
    return this.http.get<Term[]>(`${this.baseUrl}/terms`);
  }

  createTerm(term: TermRequest): Observable<Term> {
    return this.http.post<Term>(`${this.baseUrl}/terms`, term);
  }

  updateTerm(id: number, term: TermRequest): Observable<Term> {
    return this.http.put<Term>(`${this.baseUrl}/terms/${id}`, term);
  }

  deleteTerm(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/terms/${id}`);
  }

  // --- Teachers ---
  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.baseUrl}/teachers`);
  }

  createTeacher(teacher: TeacherRequest): Observable<Teacher> {
    return this.http.post<Teacher>(`${this.baseUrl}/teachers`, teacher);
  }

  updateTeacher(id: number, teacher: TeacherRequest): Observable<Teacher> {
    return this.http.put<Teacher>(`${this.baseUrl}/teachers/${id}`, teacher);
  }

  deleteTeacher(id: number, reason: string = ''): Observable<void> {
    let params = new HttpParams();
    if (reason) {
      params = params.set('reason', reason);
    }
    return this.http.delete<void>(`${this.baseUrl}/teachers/${id}`, { params });
  }

  // --- Students ---
  getStudents(page: number = 0, size: number = 20): Observable<PageResponse<Student>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Student>>(`${this.baseUrl}/students`, { params });
  }

  getAllStudentsList(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/students/all`);
  }

  getStudentDetail(id: number): Observable<StudentDetail> {
    return this.http.get<StudentDetail>(`${this.baseUrl}/students/${id}/detail`);
  }

  createStudent(student: StudentRequest): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}/students`, student);
  }

  updateStudent(id: number, student: StudentRequest): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/students/${id}`, student);
  }

  deleteStudent(id: number, reason: string = ''): Observable<void> {
    let params = new HttpParams();
    if (reason) {
      params = params.set('reason', reason);
    }
    return this.http.delete<void>(`${this.baseUrl}/students/${id}`, { params });
  }

  // --- Classrooms ---
  getClassrooms(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${this.baseUrl}/classrooms`);
  }

  getClassroomById(id: number): Observable<Classroom> {
    return this.http.get<Classroom>(`${this.baseUrl}/classrooms/${id}`);
  }

  createClassroom(classroom: ClassroomRequest): Observable<Classroom> {
    return this.http.post<Classroom>(`${this.baseUrl}/classrooms`, classroom);
  }

  updateClassroom(id: number, classroom: ClassroomRequest): Observable<Classroom> {
    return this.http.put<Classroom>(`${this.baseUrl}/classrooms/${id}`, classroom);
  }

  deleteClassroom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/classrooms/${id}`);
  }

  assignTeachers(classroomId: number, teacherIds: number[]): Observable<Classroom> {
    return this.http.post<Classroom>(`${this.baseUrl}/classrooms/${classroomId}/teachers`, { teacherIds });
  }

  removeTeacher(classroomId: number, teacherId: number): Observable<Classroom> {
    return this.http.delete<Classroom>(`${this.baseUrl}/classrooms/${classroomId}/teachers/${teacherId}`);
  }

  assignStudents(classroomId: number, studentIds: number[]): Observable<Classroom> {
    return this.http.post<Classroom>(`${this.baseUrl}/classrooms/${classroomId}/students`, { studentIds });
  }

  removeStudent(classroomId: number, studentId: number): Observable<Classroom> {
    return this.http.delete<Classroom>(`${this.baseUrl}/classrooms/${classroomId}/students/${studentId}`);
  }

  // --- Teacher Dashboard & Scoped Endpoints ---
  getTeacherDashboard(teacherId?: number | null): Observable<TeacherDashboardResponse> {
    let params = new HttpParams();
    if (teacherId) {
      params = params.set('teacherId', teacherId.toString());
    }
    return this.http.get<TeacherDashboardResponse>(`${this.baseUrl}/teacher/dashboard`, { params });
  }

  getTeacherClassroom(id: number): Observable<Classroom> {
    return this.http.get<Classroom>(`${this.baseUrl}/teacher/classrooms/${id}`);
  }

  getTeacherClassroomStudents(classroomId: number, query: string = '', page: number = 0, size: number = 20, sort: string = 'firstName'): Observable<PageResponse<Student>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `${sort},asc`);
    if (query) {
      params = params.set('query', query);
    }
    return this.http.get<PageResponse<Student>>(`${this.baseUrl}/teacher/classrooms/${classroomId}/students`, { params });
  }

  getTeacherStudentDetail(studentId: number): Observable<StudentDetail> {
    return this.http.get<StudentDetail>(`${this.baseUrl}/teacher/students/${studentId}`);
  }

  // --- Past History & Departure Archive (Admin Only) ---
  getDepartureHistory(type: 'STUDENT' | 'TEACHER', query: string = '', page: number = 0, size: number = 15): Observable<PageResponse<DepartureHistory>> {
    let params = new HttpParams()
      .set('type', type)
      .set('page', page)
      .set('size', size);
    if (query) {
      params = params.set('query', query);
    }
    return this.http.get<PageResponse<DepartureHistory>>(`${this.baseUrl}/admin/history`, { params });
  }

  getDepartureHistoryDetail(id: number): Observable<DepartureHistory> {
    return this.http.get<DepartureHistory>(`${this.baseUrl}/admin/history/${id}`);
  }

  getDepartureHistoryCounts(): Observable<HistoryCounts> {
    return this.http.get<HistoryCounts>(`${this.baseUrl}/admin/history/counts`);
  }
}
