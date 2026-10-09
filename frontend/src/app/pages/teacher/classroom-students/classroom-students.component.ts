import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Classroom } from '../../../models/classroom.model';
import { Student, PageResponse } from '../../../models/student.model';

@Component({
  selector: 'app-classroom-students',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px 40px;">
      <!-- Navigation Breadcrumb -->
      <div style="margin-bottom: 20px;">
        <a routerLink="/teacher/dashboard" style="color: var(--text-muted); text-decoration: none; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 6px;">
          <span class="material-icons-outlined" style="font-size: 16px;">arrow_back</span> Back to Dashboard
        </a>
      </div>

      <!-- Classroom Banner -->
      <div *ngIf="classroom" class="glass-panel" style="padding: 28px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center; background: #ffffff;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <span class="badge" [ngClass]="getBadgeClass(classroom.term.status)">{{ classroom.term.name }}</span>
            <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600;">Room {{ classroom.roomNumber }}</span>
          </div>
          <h2 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px; color: #09090b;">{{ classroom.name }}</h2>
          <p style="color: #71717a; font-weight: 600; font-size: 0.95rem; margin-top: 4px;">
            Subject: {{ classroom.subject }} • Grade: {{ classroom.gradeSection }}
          </p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 2rem; font-weight: 800; color: #09090b;">{{ pageResponse?.totalElements || 0 }}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Enrolled Students</div>
        </div>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="glass-panel" style="padding: 16px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; gap: 16px; background: #ffffff;">
        <div style="position: relative; flex: 1; max-width: 400px;">
          <span class="material-icons-outlined" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);">search</span>
          <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearchChange()" class="form-input" style="padding-left: 42px;" placeholder="Search student by name, roll number, or grade...">
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <label class="form-label" style="margin:0;">Sort By:</label>
          <select [(ngModel)]="sortBy" (change)="loadStudents()" class="form-select" style="width: auto; padding: 8px 14px;">
            <option value="firstName">First Name</option>
            <option value="rollNumber">Roll Number</option>
            <option value="grade">Grade</option>
          </select>
        </div>
      </div>

      <!-- Students Data Table -->
      <div class="table-container glass-panel">
        <table class="data-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Full Name</th>
              <th>Grade</th>
              <th>Gender</th>
              <th>Guardian Contact</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="isLoading">
              <td colspan="6" style="text-align: center; padding: 40px;">
                <div class="spinner" style="margin: 0 auto;"></div>
              </td>
            </tr>
            <tr *ngIf="!isLoading && pageResponse?.content?.length === 0">
              <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
                No students found in this classroom matching your search criteria.
              </td>
            </tr>
            <tr *ngFor="let s of pageResponse?.content" style="cursor: pointer;" [routerLink]="['/teacher/students', s.id]">
              <td>
                <span style="font-family: monospace; font-weight: 700; color: #09090b;">{{ s.rollNumber }}</span>
              </td>
              <td>
                <div style="font-weight: 700; color: #09090b;">{{ s.fullName }}</div>
                <div style="font-size: 0.775rem; color: var(--text-muted);">DOB: {{ s.dateOfBirth }}</div>
              </td>
              <td>{{ s.grade }}</td>
              <td>{{ s.gender }}</td>
              <td>
                <div style="font-weight: 600; color: #09090b;">{{ s.guardianName }}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">{{ s.guardianPhone }}</div>
              </td>
              <td style="text-align: right;">
                <span class="btn btn-secondary btn-sm">
                  View Profile <span class="material-icons-outlined" style="font-size: 14px;">chevron_right</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination Controls -->
        <div *ngIf="pageResponse && pageResponse.totalPages > 1" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-top: 1px solid var(--surface-border);">
          <span style="font-size: 0.85rem; color: var(--text-muted);">
            Showing Page {{ pageResponse.number + 1 }} of {{ pageResponse.totalPages }} (Total {{ pageResponse.totalElements }} items)
          </span>
          <div style="display: flex; gap: 8px;">
            <button (click)="changePage(currentPage - 1)" [disabled]="currentPage === 0" class="btn btn-secondary btn-sm">
              Previous
            </button>
            <button (click)="changePage(currentPage + 1)" [disabled]="currentPage >= pageResponse.totalPages - 1" class="btn btn-secondary btn-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ClassroomStudentsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);

  classroomId!: number;
  classroom: Classroom | null = null;
  pageResponse: PageResponse<Student> | null = null;
  isLoading = true;

  searchQuery = '';
  sortBy = 'firstName';
  currentPage = 0;
  pageSize = 15;

  ngOnInit(): void {
    this.classroomId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadClassroom();
    this.loadStudents();
  }

  loadClassroom(): void {
    this.apiService.getClassroomById(this.classroomId).subscribe({
      next: (res: Classroom) => this.classroom = res
    });
  }

  loadStudents(): void {
    this.isLoading = true;
    this.apiService.getTeacherClassroomStudents(this.classroomId, this.searchQuery, this.currentPage, this.pageSize).subscribe({
      next: (res: PageResponse<Student>) => {
        this.pageResponse = res;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.loadStudents();
  }

  changePage(newPage: number): void {
    this.currentPage = newPage;
    this.loadStudents();
  }

  getBadgeClass(status: string): string {
    if (status === 'CURRENT') return 'badge-current';
    if (status === 'FUTURE') return 'badge-future';
    return 'badge-past';
  }
}
