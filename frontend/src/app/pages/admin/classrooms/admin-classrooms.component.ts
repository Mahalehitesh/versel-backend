import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ToastService } from '../../../services/toast.service';
import { Classroom } from '../../../models/classroom.model';
import { Term } from '../../../models/term.model';
import { Teacher } from '../../../models/teacher.model';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'app-admin-classrooms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  template: `
    <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px 40px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
        <div>
          <h2 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px;">Manage Classrooms</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Create classrooms and assign teachers & students.</p>
        </div>
        <button (click)="openClassroomModal()" class="btn btn-primary">
          <span class="material-icons-outlined">add_business</span> Create Classroom
        </button>
      </div>

      <div class="table-container glass-panel">
        <table class="data-table">
          <thead>
            <tr>
              <th>Classroom Name</th>
              <th>Subject & Grade</th>
              <th>Room</th>
              <th>Term</th>
              <th>Teachers</th>
              <th>Students</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="isLoading">
              <td colspan="7" style="text-align: center; padding: 40px;"><div class="spinner" style="margin: 0 auto;"></div></td>
            </tr>
            <tr *ngFor="let c of classrooms">
              <td style="font-weight: 800;">
                <a [routerLink]="['/teacher/classrooms', c.id, 'students']" style="color: var(--text-main); text-decoration: none;">
                  {{ c.name }}
                </a>
              </td>
              <td>
                <div>{{ c.subject }}</div>
                <div style="font-size: 0.775rem; color: var(--text-muted);">{{ c.gradeSection }}</div>
              </td>
              <td>{{ c.roomNumber }}</td>
              <td><span class="badge" [ngClass]="getBadgeClass(c.term.status)">{{ c.term.name }}</span></td>
              <td>
                <button (click)="openTeacherAssignModal(c)" class="btn btn-secondary btn-sm" style="display: flex; align-items: center; gap: 4px;">
                  <span class="material-icons-outlined" style="font-size: 16px;">badge</span>
                  {{ c.teacherCount }} Assigned
                </button>
              </td>
              <td>
                <button (click)="openStudentAssignModal(c)" class="btn btn-secondary btn-sm" style="display: flex; align-items: center; gap: 4px;">
                  <span class="material-icons-outlined" style="font-size: 16px;">groups</span>
                  {{ c.studentCount }} Enrolled
                </button>
              </td>
              <td style="text-align: right;">
                <button (click)="openClassroomModal(c)" class="btn btn-secondary btn-sm" style="margin-right: 6px;">Edit</button>
                <button (click)="deleteClassroom(c.id)" class="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 1. Classroom Create / Edit Modal -->
      <div *ngIf="isClassroomModalOpen" class="modal-backdrop">
        <div class="modal-content">
          <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 20px;">
            {{ editingClassroomId ? 'Edit Classroom' : 'Create New Classroom' }}
          </h3>
          <form [formGroup]="classroomForm" (ngSubmit)="saveClassroom()">
            <div class="form-group">
              <label class="form-label">Classroom Name</label>
              <input type="text" formControlName="name" class="form-input" placeholder="e.g. AP Biology">
            </div>
            <div class="form-group">
              <label class="form-label">Grade / Section</label>
              <input type="text" formControlName="gradeSection" class="form-input" placeholder="Grade 11-A">
            </div>
            <div class="form-group">
              <label class="form-label">Subject</label>
              <input type="text" formControlName="subject" class="form-input" placeholder="Science">
            </div>
            <div class="form-group">
              <label class="form-label">Room Number</label>
              <input type="text" formControlName="roomNumber" class="form-input" placeholder="Lab 204">
            </div>
            <div class="form-group">
              <label class="form-label">Academic Term</label>
              <select formControlName="termId" class="form-select">
                <option [ngValue]="null">-- Select Term --</option>
                <option *ngFor="let t of terms" [value]="t.id">{{ t.name }} ({{ t.status }})</option>
              </select>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
              <button type="button" (click)="isClassroomModalOpen = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" [disabled]="classroomForm.invalid" class="btn btn-primary">Save Classroom</button>
            </div>
          </form>
        </div>
      </div>

      <!-- 2. Teacher Assignment Modal -->
      <div *ngIf="isTeacherModalOpen && selectedClassroom" class="modal-backdrop">
        <div class="modal-content">
          <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 8px;">
            Assign Teachers to {{ selectedClassroom.name }}
          </h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">
            Select teachers to assign to this classroom (Many-to-Many assignment).
          </p>

          <div style="max-height: 260px; overflow-y: auto; margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
            <label *ngFor="let t of allTeachers" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(15,23,42,0.6); border-radius: var(--radius-sm); cursor: pointer;">
              <div>
                <strong style="color: var(--text-main); font-size: 0.9rem;">{{ t.fullName }}</strong>
                <div style="font-size: 0.775rem; color: var(--text-muted);">{{ t.department }} • EMP: {{ t.employeeId }}</div>
              </div>
              <input type="checkbox" [checked]="isTeacherSelected(t.id)" (change)="toggleTeacherSelection(t.id)">
            </label>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px;">
            <button type="button" (click)="isTeacherModalOpen = false" class="btn btn-secondary">Cancel</button>
            <button type="button" (click)="saveTeacherAssignments()" class="btn btn-primary">Save Assignments</button>
          </div>
        </div>
      </div>

      <!-- 3. Student Assignment Modal -->
      <div *ngIf="isStudentModalOpen && selectedClassroom" class="modal-backdrop">
        <div class="modal-content">
          <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 8px;">
            Assign Students to {{ selectedClassroom.name }}
          </h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">
            Check students to enroll in this classroom.
          </p>

          <div style="max-height: 280px; overflow-y: auto; margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
            <label *ngFor="let s of allStudents" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(15,23,42,0.6); border-radius: var(--radius-sm); cursor: pointer;">
              <div>
                <strong style="color: var(--text-main); font-size: 0.9rem;">{{ s.fullName }}</strong>
                <div style="font-size: 0.775rem; color: var(--text-muted);">Roll: {{ s.rollNumber }} • {{ s.grade }}</div>
              </div>
              <input type="checkbox" [checked]="isStudentSelected(s.id)" (change)="toggleStudentSelection(s.id)">
            </label>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px;">
            <button type="button" (click)="isStudentModalOpen = false" class="btn btn-secondary">Cancel</button>
            <button type="button" (click)="saveStudentAssignments()" class="btn btn-primary">Save Enrolled Students</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminClassroomsComponent implements OnInit {
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  classrooms: Classroom[] = [];
  terms: Term[] = [];
  allTeachers: Teacher[] = [];
  allStudents: Student[] = [];

  isLoading = true;

  // Modals state
  isClassroomModalOpen = false;
  editingClassroomId: number | null = null;

  isTeacherModalOpen = false;
  isStudentModalOpen = false;
  selectedClassroom: Classroom | null = null;

  selectedTeacherIds: Set<number> = new Set();
  selectedStudentIds: Set<number> = new Set();

  classroomForm = this.fb.group({
    name: ['', [Validators.required]],
    gradeSection: ['', [Validators.required]],
    subject: ['', [Validators.required]],
    roomNumber: ['', [Validators.required]],
    termId: [null as number | null, [Validators.required]]
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.apiService.getClassrooms().subscribe({
      next: (res: Classroom[]) => {
        this.classrooms = res;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });

    this.apiService.getTerms().subscribe((res: Term[]) => this.terms = res);
    this.apiService.getTeachers().subscribe((res: Teacher[]) => this.allTeachers = res);
    this.apiService.getAllStudentsList().subscribe((res: Student[]) => this.allStudents = res);
  }

  openClassroomModal(classroom?: Classroom): void {
    if (classroom) {
      this.editingClassroomId = classroom.id;
      this.classroomForm.patchValue({
        name: classroom.name,
        gradeSection: classroom.gradeSection,
        subject: classroom.subject,
        roomNumber: classroom.roomNumber,
        termId: classroom.term.id
      });
    } else {
      this.editingClassroomId = null;
      this.classroomForm.reset();
    }
    this.isClassroomModalOpen = true;
  }

  saveClassroom(): void {
    if (this.classroomForm.invalid) return;
    const val = this.classroomForm.value as any;

    if (this.editingClassroomId) {
      this.apiService.updateClassroom(this.editingClassroomId, val).subscribe({
        next: () => {
          this.toastService.success('Classroom updated successfully');
          this.isClassroomModalOpen = false;
          this.loadData();
        },
        error: (err: any) => this.toastService.error(err.error?.message || 'Failed to update classroom')
      });
    } else {
      this.apiService.createClassroom(val).subscribe({
        next: () => {
          this.toastService.success('Classroom created successfully');
          this.isClassroomModalOpen = false;
          this.loadData();
        },
        error: (err: any) => this.toastService.error(err.error?.message || 'Failed to create classroom')
      });
    }
  }

  deleteClassroom(id: number): void {
    if (!confirm('Are you sure you want to delete this classroom?')) return;
    this.apiService.deleteClassroom(id).subscribe({
      next: () => {
        this.toastService.success('Classroom deleted');
        this.loadData();
      },
      error: (err: any) => this.toastService.error(err.error?.message || 'Failed to delete classroom')
    });
  }

  // Teacher Assignment Handlers
  openTeacherAssignModal(classroom: Classroom): void {
    this.selectedClassroom = classroom;
    this.selectedTeacherIds = new Set((classroom.teachers || []).map(t => t.id));
    this.isTeacherModalOpen = true;
  }

  isTeacherSelected(teacherId: number): boolean {
    return this.selectedTeacherIds.has(teacherId);
  }

  toggleTeacherSelection(teacherId: number): void {
    if (this.selectedTeacherIds.has(teacherId)) {
      this.selectedTeacherIds.delete(teacherId);
    } else {
      this.selectedTeacherIds.add(teacherId);
    }
  }

  saveTeacherAssignments(): void {
    if (!this.selectedClassroom) return;
    const teacherIds = Array.from(this.selectedTeacherIds);
    this.apiService.assignTeachers(this.selectedClassroom.id, teacherIds).subscribe({
      next: () => {
        this.toastService.success('Teacher assignments saved');
        this.isTeacherModalOpen = false;
        this.loadData();
      },
      error: (err: any) => this.toastService.error(err.error?.message || 'Failed to assign teachers')
    });
  }

  // Student Assignment Handlers
  openStudentAssignModal(classroom: Classroom): void {
    this.selectedClassroom = classroom;
    this.selectedStudentIds = new Set((classroom.students || []).map(s => s.id));
    this.isStudentModalOpen = true;
  }

  isStudentSelected(studentId: number): boolean {
    return this.selectedStudentIds.has(studentId);
  }

  toggleStudentSelection(studentId: number): void {
    if (this.selectedStudentIds.has(studentId)) {
      this.selectedStudentIds.delete(studentId);
    } else {
      this.selectedStudentIds.add(studentId);
    }
  }

  saveStudentAssignments(): void {
    if (!this.selectedClassroom) return;
    const studentIds = Array.from(this.selectedStudentIds);
    this.apiService.assignStudents(this.selectedClassroom.id, studentIds).subscribe({
      next: () => {
        this.toastService.success('Student enrollments saved');
        this.isStudentModalOpen = false;
        this.loadData();
      },
      error: (err: any) => this.toastService.error(err.error?.message || 'Failed to assign students')
    });
  }

  getBadgeClass(status: string): string {
    if (status === 'CURRENT') return 'badge-current';
    if (status === 'FUTURE') return 'badge-future';
    return 'badge-past';
  }
}
