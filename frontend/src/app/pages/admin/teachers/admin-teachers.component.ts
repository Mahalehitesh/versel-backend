import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ToastService } from '../../../services/toast.service';
import { Teacher } from '../../../models/teacher.model';

@Component({
  selector: 'app-admin-teachers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px 40px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
        <div>
          <h2 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px; color: #09090b;">Manage Teachers</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Register teacher accounts and update department credentials.</p>
        </div>
        <button (click)="openModal()" class="btn btn-primary">
          <span class="material-icons-outlined">person_add</span> Register Teacher
        </button>
      </div>

      <div class="table-container glass-panel">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Full Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Department</th>
              <th>Phone</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="isLoading">
              <td colspan="7" style="text-align: center; padding: 40px;"><div class="spinner" style="margin: 0 auto;"></div></td>
            </tr>
            <tr *ngFor="let t of teachers">
              <td><span style="font-family: monospace; font-weight: 700; color: #09090b;">{{ t.employeeId }}</span></td>
              <td style="font-weight: 700;">{{ t.fullName }}</td>
              <td><code>{{ t.username }}</code></td>
              <td>{{ t.email }}</td>
              <td>{{ t.department || 'N/A' }}</td>
              <td>{{ t.phone || 'N/A' }}</td>
              <td style="text-align: right;">
                <button (click)="openModal(t)" class="btn btn-secondary btn-sm" style="margin-right: 8px;">Edit</button>
                <button (click)="openDeleteModal(t)" class="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create / Edit Teacher Modal -->
      <div *ngIf="isModalOpen" class="modal-backdrop">
        <div class="modal-content">
          <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 20px;">
            {{ editingTeacherId ? 'Edit Teacher' : 'Register New Teacher' }}
          </h3>
          <form [formGroup]="teacherForm" (ngSubmit)="saveTeacher()">
            <div class="form-group" *ngIf="!editingTeacherId">
              <label class="form-label">Username</label>
              <input type="text" formControlName="username" class="form-input" placeholder="e.g. t_smith">
            </div>
            <div class="form-group">
              <label class="form-label">Password {{ editingTeacherId ? '(leave blank to keep unchanged)' : '' }}</label>
              <input type="password" formControlName="password" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" formControlName="fullName" class="form-input" placeholder="e.g. John Smith">
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" formControlName="email" class="form-input" placeholder="teacher@school.com">
            </div>
            <div class="form-group">
              <label class="form-label">Employee ID</label>
              <input type="text" formControlName="employeeId" class="form-input" placeholder="EMP101">
            </div>
            <div class="form-group">
              <label class="form-label">Department</label>
              <input type="text" formControlName="department" class="form-input" placeholder="Mathematics">
            </div>
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input type="text" formControlName="phone" class="form-input" placeholder="+1-555-0100">
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
              <button type="button" (click)="closeModal()" class="btn btn-secondary">Cancel</button>
              <button type="submit" [disabled]="teacherForm.invalid" class="btn btn-primary">Save Teacher</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete / Exit Reason Modal -->
      <div *ngIf="isDeleteModalOpen && teacherToDelete" class="modal-backdrop">
        <div class="modal-content" style="max-width: 520px; padding: 28px; background: #ffffff;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center;">
              <span class="material-icons-outlined" style="font-size: 24px;">person_remove</span>
            </div>
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: #09090b; margin: 0;">Remove Teacher & Archive</h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin: 2px 0 0;">Record departure in Past History</p>
            </div>
          </div>

          <div style="background: #fafafa; border: 1px solid var(--surface-border); border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
            <div style="font-weight: 800; color: #09090b; font-size: 1rem;">{{ teacherToDelete.fullName }}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
              Employee ID: <span style="font-family: monospace; font-weight: 700; color: #09090b;">{{ teacherToDelete.employeeId }}</span> • Department: {{ teacherToDelete.department || 'General' }}
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <label class="form-label" style="font-weight: 700; color: #09090b;">
              Reason for Leaving / Exit Reason <span style="color: #dc2626;">*</span>
            </label>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">
              Specify why this teacher is leaving or ending their service. This will be preserved in the Past History archive.
            </p>

            <!-- Quick Reason Chips -->
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
              <button type="button" *ngFor="let opt of quickTeacherReasons" (click)="deleteReason = opt" 
                      class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 4px 8px; border-radius: 14px;"
                      [style.background]="deleteReason === opt ? '#09090b' : ''"
                      [style.color]="deleteReason === opt ? '#ffffff' : ''">
                {{ opt }}
              </button>
            </div>

            <textarea [(ngModel)]="deleteReason" class="form-textarea" rows="3" 
                      placeholder="e.g. Resigned / Career move, Retired after service, Employment contract concluded, Relocated..."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" (click)="closeDeleteModal()" class="btn btn-secondary">
              Cancel
            </button>
            <button type="button" (click)="confirmDeleteTeacher()" [disabled]="!deleteReason.trim()" class="btn btn-danger" style="display: flex; align-items: center; gap: 6px;">
              <span class="material-icons-outlined" style="font-size: 16px;">archive</span> Confirm & Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminTeachersComponent implements OnInit {
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  teachers: Teacher[] = [];
  isLoading = true;
  isModalOpen = false;
  editingTeacherId: number | null = null;

  isDeleteModalOpen = false;
  teacherToDelete: Teacher | null = null;
  deleteReason = '';
  quickTeacherReasons = [
    'Resigned / Career move',
    'Retired after years of service',
    'Employment contract concluded',
    'Relocated out of district',
    'Personal / Family reasons'
  ];

  teacherForm = this.fb.group({
    username: ['', [Validators.required]],
    password: [''],
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    employeeId: ['', [Validators.required]],
    department: [''],
    phone: ['']
  });

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.isLoading = true;
    this.apiService.getTeachers().subscribe({
      next: (res: Teacher[]) => {
        this.teachers = res;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  openModal(teacher?: Teacher): void {
    if (teacher) {
      this.editingTeacherId = teacher.id;
      this.teacherForm.controls.username.clearValidators();
      this.teacherForm.controls.username.updateValueAndValidity();
      this.teacherForm.patchValue({
        username: teacher.username,
        password: '',
        fullName: teacher.fullName,
        email: teacher.email,
        employeeId: teacher.employeeId,
        department: teacher.department,
        phone: teacher.phone
      });
    } else {
      this.editingTeacherId = null;
      this.teacherForm.controls.username.setValidators([Validators.required]);
      this.teacherForm.controls.username.updateValueAndValidity();
      this.teacherForm.reset();
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveTeacher(): void {
    if (this.teacherForm.invalid) return;
    const val = this.teacherForm.value as any;

    if (this.editingTeacherId) {
      this.apiService.updateTeacher(this.editingTeacherId, val).subscribe({
        next: () => {
          this.toastService.success('Teacher updated successfully');
          this.closeModal();
          this.loadTeachers();
        },
        error: (err: any) => this.toastService.error(err.error?.message || 'Failed to update teacher')
      });
    } else {
      this.apiService.createTeacher(val).subscribe({
        next: () => {
          this.toastService.success('Teacher registered successfully');
          this.closeModal();
          this.loadTeachers();
        },
        error: (err: any) => this.toastService.error(err.error?.message || 'Failed to register teacher')
      });
    }
  }

  openDeleteModal(teacher: Teacher): void {
    this.teacherToDelete = teacher;
    this.deleteReason = '';
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.teacherToDelete = null;
    this.deleteReason = '';
  }

  confirmDeleteTeacher(): void {
    if (!this.teacherToDelete || !this.deleteReason.trim()) return;
    const id = this.teacherToDelete.id;
    const reason = this.deleteReason.trim();

    this.apiService.deleteTeacher(id, reason).subscribe({
      next: () => {
        this.toastService.success('Teacher removed and recorded in Past History archive');
        this.closeDeleteModal();
        this.loadTeachers();
      },
      error: (err: any) => this.toastService.error(err.error?.message || 'Failed to delete teacher')
    });
  }
}
