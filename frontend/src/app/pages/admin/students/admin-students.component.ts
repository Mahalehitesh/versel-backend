import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ToastService } from '../../../services/toast.service';
import { Student, PageResponse } from '../../../models/student.model';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  template: `
    <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px 40px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
        <div>
          <h2 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px; color: #09090b;">Manage Students</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Register new student profiles and maintain guardian & academic records.</p>
        </div>
        <button (click)="openModal()" class="btn btn-primary">
          <span class="material-icons-outlined">person_add</span> Register Student
        </button>
      </div>

      <div class="table-container glass-panel">
        <table class="data-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Full Name</th>
              <th>Grade</th>
              <th>Gender</th>
              <th>Guardian Contact</th>
              <th>Enrollment Date</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="isLoading">
              <td colspan="7" style="text-align: center; padding: 40px;"><div class="spinner" style="margin: 0 auto;"></div></td>
            </tr>
            <tr *ngFor="let s of pageResponse?.content">
              <td><span style="font-family: monospace; font-weight: 700; color: #09090b;">{{ s.rollNumber }}</span></td>
              <td>
                <a [routerLink]="['/teacher/students', s.id]" style="color: var(--text-main); font-weight: 700; text-decoration: none;">
                  {{ s.fullName }}
                </a>
              </td>
              <td>{{ s.grade }}</td>
              <td>{{ s.gender }}</td>
              <td>
                <div>{{ s.guardianName }}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">{{ s.guardianPhone }}</div>
              </td>
              <td>{{ s.enrollmentDate }}</td>
              <td style="text-align: right;">
                <button (click)="openModal(s)" class="btn btn-secondary btn-sm" style="margin-right: 8px;">Edit</button>
                <button (click)="openDeleteModal(s)" class="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination Controls -->
        <div *ngIf="pageResponse && pageResponse.totalPages > 1" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-top: 1px solid var(--surface-border);">
          <span style="font-size: 0.85rem; color: var(--text-muted);">
            Page {{ pageResponse.number + 1 }} of {{ pageResponse.totalPages }}
          </span>
          <div style="display: flex; gap: 8px;">
            <button (click)="changePage(currentPage - 1)" [disabled]="currentPage === 0" class="btn btn-secondary btn-sm">Previous</button>
            <button (click)="changePage(currentPage + 1)" [disabled]="currentPage >= pageResponse.totalPages - 1" class="btn btn-secondary btn-sm">Next</button>
          </div>
        </div>
      </div>

      <!-- Create / Edit Student Modal -->
      <div *ngIf="isModalOpen" class="modal-backdrop">
        <div class="modal-content" style="max-width: 680px;">
          <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 20px;">
            {{ editingStudentId ? 'Edit Student' : 'Add New Student' }}
          </h3>
          <form [formGroup]="studentForm" (ngSubmit)="saveStudent()">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Roll Number</label>
                <input type="text" formControlName="rollNumber" class="form-input" placeholder="STU001">
              </div>
              <div class="form-group">
                <label class="form-label">Grade</label>
                <input type="text" formControlName="grade" class="form-input" placeholder="Grade 10-A">
              </div>
              <div class="form-group">
                <label class="form-label">First Name</label>
                <input type="text" formControlName="firstName" class="form-input" placeholder="First Name">
              </div>
              <div class="form-group">
                <label class="form-label">Last Name</label>
                <input type="text" formControlName="lastName" class="form-input" placeholder="Last Name">
              </div>
              <div class="form-group">
                <label class="form-label">Date of Birth</label>
                <input type="date" formControlName="dateOfBirth" class="form-input">
              </div>
              <div class="form-group">
                <label class="form-label">Gender</label>
                <select formControlName="gender" class="form-select">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Contact Email</label>
                <input type="email" formControlName="contactEmail" class="form-input" placeholder="student@school.com">
              </div>
              <div class="form-group">
                <label class="form-label">Contact Phone</label>
                <input type="text" formControlName="contactPhone" class="form-input" placeholder="+1-555-0199">
              </div>
              <div class="form-group">
                <label class="form-label">Guardian Name</label>
                <input type="text" formControlName="guardianName" class="form-input" placeholder="Guardian Name">
              </div>
              <div class="form-group">
                <label class="form-label">Guardian Phone</label>
                <input type="text" formControlName="guardianPhone" class="form-input" placeholder="+1-555-0999">
              </div>
              <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Residential Address</label>
                <input type="text" formControlName="address" class="form-input" placeholder="Street Address, City">
              </div>
              <div class="form-group">
                <label class="form-label">Enrollment Date</label>
                <input type="date" formControlName="enrollmentDate" class="form-input">
              </div>
              <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Notes</label>
                <textarea formControlName="notes" class="form-textarea" rows="2" placeholder="Additional observations or medical notes..."></textarea>
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
              <button type="button" (click)="closeModal()" class="btn btn-secondary">Cancel</button>
              <button type="submit" [disabled]="studentForm.invalid" class="btn btn-primary">Save Student</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete / Exit Reason Modal -->
      <div *ngIf="isDeleteModalOpen && studentToDelete" class="modal-backdrop">
        <div class="modal-content" style="max-width: 520px; padding: 28px; background: #ffffff;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons-outlined" style="font-size: 24px;">person_remove</span>
            </div>
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: #09090b; margin: 0;">Remove Student & Archive</h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin: 2px 0 0;">Record departure in Past History</p>
            </div>
          </div>

          <div style="background: #fafafa; border: 1px solid var(--surface-border); border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
            <div style="font-weight: 800; color: #09090b; font-size: 1rem;">{{ studentToDelete.fullName }}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
              Roll Number: <span style="font-family: monospace; font-weight: 700; color: #09090b;">{{ studentToDelete.rollNumber }}</span> • Grade: {{ studentToDelete.grade }}
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <label class="form-label" style="font-weight: 700; color: #09090b;">
              Reason for Leaving / Exit Reason <span style="color: #dc2626;">*</span>
            </label>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">
              Specify why this student is leaving the school. This will be preserved in the Past History archive.
            </p>

            <!-- Quick Reason Chips -->
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
              <button type="button" *ngFor="let opt of quickStudentReasons" (click)="deleteReason = opt" 
                      class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 4px 8px; border-radius: 14px;"
                      [style.background]="deleteReason === opt ? '#09090b' : ''"
                      [style.color]="deleteReason === opt ? '#ffffff' : ''">
                {{ opt }}
              </button>
            </div>

            <textarea [(ngModel)]="deleteReason" class="form-textarea" rows="3" 
                      placeholder="e.g. Transferred to another school, Graduated, Relocated with family, Personal/Medical leave..."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" (click)="closeDeleteModal()" class="btn btn-secondary">
              Cancel
            </button>
            <button type="button" (click)="confirmDeleteStudent()" [disabled]="!deleteReason.trim()" class="btn btn-danger" style="display: flex; align-items: center; gap: 6px;">
              <span class="material-icons-outlined" style="font-size: 16px;">archive</span> Confirm & Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminStudentsComponent implements OnInit {
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  pageResponse: PageResponse<Student> | null = null;
  currentPage = 0;
  pageSize = 15;
  isLoading = true;
  isModalOpen = false;
  editingStudentId: number | null = null;

  isDeleteModalOpen = false;
  studentToDelete: Student | null = null;
  deleteReason = '';
  quickStudentReasons = [
    'Transferred to another school',
    'Graduated / Completed curriculum',
    'Relocated with family',
    'Personal / Medical reasons',
    'Withdrawn by guardian'
  ];

  studentForm = this.fb.group({
    rollNumber: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    dateOfBirth: ['', [Validators.required]],
    gender: ['Male', [Validators.required]],
    grade: ['', [Validators.required]],
    contactEmail: [''],
    contactPhone: [''],
    guardianName: ['', [Validators.required]],
    guardianPhone: ['', [Validators.required]],
    address: ['', [Validators.required]],
    enrollmentDate: ['', [Validators.required]],
    notes: ['']
  });

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading = true;
    this.apiService.getStudents(this.currentPage, this.pageSize).subscribe({
      next: (res: PageResponse<Student>) => {
        this.pageResponse = res;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  changePage(newPage: number): void {
    this.currentPage = newPage;
    this.loadStudents();
  }

  openModal(student?: Student): void {
    if (student) {
      this.editingStudentId = student.id;
      this.studentForm.patchValue({
        rollNumber: student.rollNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        grade: student.grade,
        contactEmail: student.contactEmail || '',
        contactPhone: student.contactPhone || '',
        guardianName: student.guardianName,
        guardianPhone: student.guardianPhone,
        address: student.address,
        enrollmentDate: student.enrollmentDate,
        notes: student.notes || ''
      });
    } else {
      this.editingStudentId = null;
      this.studentForm.reset({ gender: 'Male' });
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveStudent(): void {
    if (this.studentForm.invalid) return;
    const val = this.studentForm.value as any;

    if (this.editingStudentId) {
      this.apiService.updateStudent(this.editingStudentId, val).subscribe({
        next: () => {
          this.toastService.success('Student updated successfully');
          this.closeModal();
          this.loadStudents();
        },
        error: (err: any) => this.toastService.error(err.error?.message || 'Failed to update student')
      });
    } else {
      this.apiService.createStudent(val).subscribe({
        next: () => {
          this.toastService.success('Student created successfully');
          this.closeModal();
          this.loadStudents();
        },
        error: (err: any) => this.toastService.error(err.error?.message || 'Failed to create student')
      });
    }
  }

  openDeleteModal(student: Student): void {
    this.studentToDelete = student;
    this.deleteReason = '';
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.studentToDelete = null;
    this.deleteReason = '';
  }

  confirmDeleteStudent(): void {
    if (!this.studentToDelete || !this.deleteReason.trim()) return;
    const id = this.studentToDelete.id;
    const reason = this.deleteReason.trim();

    this.apiService.deleteStudent(id, reason).subscribe({
      next: () => {
        this.toastService.success('Student removed and recorded in Past History archive');
        this.closeDeleteModal();
        this.loadStudents();
      },
      error: (err: any) => this.toastService.error(err.error?.message || 'Failed to delete student')
    });
  }
}
