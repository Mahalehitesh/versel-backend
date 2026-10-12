import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { DepartureHistory, HistoryCounts } from '../../../models/history.model';
import { PageResponse } from '../../../models/student.model';

@Component({
  selector: 'app-admin-history',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px 40px;">
      <!-- Header Section -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <h2 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px; color: #09090b;">
              Past History & Exit Archive
            </h2>
            <span class="badge badge-past" style="font-size: 0.75rem;">Admin Audit Log</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">
            Permanent record of students and teachers who have left the school. Captured automatically whenever a member is deleted.
          </p>
        </div>

        <!-- Summary Counts -->
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="glass-panel" style="padding: 10px 18px; display: flex; align-items: center; gap: 10px; background: #ffffff;">
            <span class="material-icons-outlined" style="font-size: 20px; color: #09090b;">school</span>
            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Left Students</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #09090b; line-height: 1;">{{ counts.students }}</div>
            </div>
          </div>
          <div class="glass-panel" style="padding: 10px 18px; display: flex; align-items: center; gap: 10px; background: #ffffff;">
            <span class="material-icons-outlined" style="font-size: 20px; color: #09090b;">badge</span>
            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Left Teachers</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #09090b; line-height: 1;">{{ counts.teachers }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls Toolbar -->
      <div class="glass-panel" style="padding: 18px 24px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; background: #ffffff;">
        <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap; flex: 1;">
          <!-- Dropdown selector: Students vs Teachers -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <label class="form-label" style="margin: 0; font-weight: 700; white-space: nowrap; color: #09090b;">Record Type:</label>
            <select [(ngModel)]="selectedType" (change)="onTypeChange()" class="form-select" style="min-width: 220px; font-weight: 700; padding: 9px 14px; border: 1.5px solid #09090b;">
              <option value="STUDENT">🎓 Students (Left School)</option>
              <option value="TEACHER">👨‍🏫 Teachers (Left School)</option>
            </select>
          </div>

          <!-- Search Input -->
          <div style="position: relative; flex: 1; min-width: 280px; max-width: 480px;">
            <span class="material-icons-outlined" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 20px;">search</span>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearchChange()" class="form-input" style="padding-left: 42px;" [placeholder]="selectedType === 'STUDENT' ? 'Search student by name, roll number, or grade...' : 'Search teacher by name, employee ID, or department...'">
          </div>
        </div>

        <button (click)="loadHistory(); loadCounts()" class="btn btn-secondary btn-sm" style="display: flex; align-items: center; gap: 6px;">
          <span class="material-icons-outlined" style="font-size: 16px;">refresh</span> Refresh Log
        </button>
      </div>

      <!-- Main History Table -->
      <div class="table-container glass-panel">
        <!-- 1. STUDENT VIEW TABLE -->
        <table *ngIf="selectedType === 'STUDENT'" class="data-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Full Name</th>
              <th>Grade</th>
              <th>Date Left</th>
              <th>Guardian / Contact</th>
              <th>Previous Classrooms</th>
              <th>Exit Reason / Notes</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="isLoading">
              <td colspan="8" style="text-align: center; padding: 48px;">
                <div class="spinner" style="margin: 0 auto;"></div>
                <div style="margin-top: 12px; color: var(--text-muted); font-size: 0.85rem;">Loading departed student records...</div>
              </td>
            </tr>
            <tr *ngIf="!isLoading && pageResponse?.content?.length === 0">
              <td colspan="8" style="text-align: center; padding: 48px; color: var(--text-muted);">
                <span class="material-icons-outlined" style="font-size: 36px; display: block; margin-bottom: 8px; color: #a1a1aa;">folder_off</span>
                No historical records of departed students matching your filter criteria.
              </td>
            </tr>
            <tr *ngFor="let item of pageResponse?.content">
              <td>
                <span style="font-family: monospace; font-weight: 800; color: #09090b; background: #f4f4f5; padding: 4px 8px; border-radius: 6px;">
                  {{ item.identifier }}
                </span>
              </td>
              <td>
                <div style="font-weight: 800; color: #09090b;">{{ item.fullName }}</div>
                <div style="font-size: 0.775rem; color: var(--text-muted);" *ngIf="item.dateOfBirth">
                  DOB: {{ item.dateOfBirth }} • {{ item.gender }}
                </div>
              </td>
              <td>
                <span class="badge badge-current" style="font-size: 0.75rem;">{{ item.departmentOrGrade }}</span>
              </td>
              <td>
                <div style="font-weight: 700; color: #09090b; font-size: 0.85rem;">
                  {{ item.departureDate | date:'mediumDate' }}
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">
                  {{ item.departureDate | date:'shortTime' }}
                </div>
              </td>
              <td>
                <div style="font-weight: 600; color: #09090b; font-size: 0.85rem;">{{ item.guardianInfo || 'N/A' }}</div>
                <div style="font-size: 0.775rem; color: var(--text-muted);" *ngIf="item.phone">{{ item.phone }}</div>
              </td>
              <td style="max-width: 220px;">
                <div style="font-size: 0.825rem; color: #09090b; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" [title]="item.previousClassrooms">
                  {{ item.previousClassrooms || 'None' }}
                </div>
              </td>
              <td style="max-width: 200px;">
                <div style="font-size: 0.825rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" [title]="item.notes">
                  {{ item.notes || 'Departed' }}
                </div>
              </td>
              <td style="text-align: right;">
                <button (click)="openDetailModal(item)" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 4px;">
                  <span class="material-icons-outlined" style="font-size: 15px;">visibility</span> Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 2. TEACHER VIEW TABLE -->
        <table *ngIf="selectedType === 'TEACHER'" class="data-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Full Name</th>
              <th>Department</th>
              <th>Date Left</th>
              <th>Contact Info</th>
              <th>Previous Classrooms</th>
              <th>Exit Reason / Notes</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="isLoading">
              <td colspan="8" style="text-align: center; padding: 48px;">
                <div class="spinner" style="margin: 0 auto;"></div>
                <div style="margin-top: 12px; color: var(--text-muted); font-size: 0.85rem;">Loading departed teacher records...</div>
              </td>
            </tr>
            <tr *ngIf="!isLoading && pageResponse?.content?.length === 0">
              <td colspan="8" style="text-align: center; padding: 48px; color: var(--text-muted);">
                <span class="material-icons-outlined" style="font-size: 36px; display: block; margin-bottom: 8px; color: #a1a1aa;">folder_off</span>
                No historical records of departed teachers matching your filter criteria.
              </td>
            </tr>
            <tr *ngFor="let item of pageResponse?.content">
              <td>
                <span style="font-family: monospace; font-weight: 800; color: #09090b; background: #f4f4f5; padding: 4px 8px; border-radius: 6px;">
                  {{ item.identifier }}
                </span>
              </td>
              <td>
                <div style="font-weight: 800; color: #09090b;">{{ item.fullName }}</div>
                <div style="font-size: 0.775rem; color: var(--text-muted);" *ngIf="item.email">
                  {{ item.email }}
                </div>
              </td>
              <td>
                <span class="badge badge-future" style="font-size: 0.75rem;">{{ item.departmentOrGrade || 'General' }}</span>
              </td>
              <td>
                <div style="font-weight: 700; color: #09090b; font-size: 0.85rem;">
                  {{ item.departureDate | date:'mediumDate' }}
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">
                  {{ item.departureDate | date:'shortTime' }}
                </div>
              </td>
              <td>
                <div style="font-weight: 600; color: #09090b; font-size: 0.85rem;">{{ item.phone || item.email || 'N/A' }}</div>
              </td>
              <td style="max-width: 220px;">
                <div style="font-size: 0.825rem; color: #09090b; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" [title]="item.previousClassrooms">
                  {{ item.previousClassrooms || 'None' }}
                </div>
              </td>
              <td style="max-width: 200px;">
                <div style="font-size: 0.825rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" [title]="item.notes">
                  {{ item.notes || 'Service ended' }}
                </div>
              </td>
              <td style="text-align: right;">
                <button (click)="openDetailModal(item)" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 4px;">
                  <span class="material-icons-outlined" style="font-size: 15px;">visibility</span> Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination Bar -->
        <div *ngIf="pageResponse && pageResponse.totalPages > 1" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-top: 1px solid var(--surface-border); background: #ffffff;">
          <span style="font-size: 0.85rem; color: var(--text-muted);">
            Showing page {{ pageResponse.number + 1 }} of {{ pageResponse.totalPages }} ({{ pageResponse.totalElements }} total archived records)
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

      <!-- Detail Modal -->
      <div *ngIf="selectedDetail" class="modal-backdrop">
        <div class="modal-content" style="max-width: 640px; padding: 32px; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 1px solid var(--surface-border); padding-bottom: 16px;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                <span class="badge badge-past">{{ selectedDetail.entityType === 'STUDENT' ? 'Departed Student' : 'Departed Teacher' }}</span>
                <span style="font-family: monospace; font-weight: 800; font-size: 0.85rem; color: #09090b;">ID: {{ selectedDetail.identifier }}</span>
              </div>
              <h3 style="font-size: 1.5rem; font-weight: 800; color: #09090b; letter-spacing: -0.5px;">{{ selectedDetail.fullName }}</h3>
            </div>
            <button (click)="selectedDetail = null" style="background:none; border:none; cursor:pointer; color: var(--text-muted);" title="Close">
              <span class="material-icons-outlined" style="font-size: 24px;">close</span>
            </button>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; font-size: 0.9rem;">
            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">{{ selectedDetail.entityType === 'STUDENT' ? 'Grade / Section' : 'Department' }}</div>
              <div style="font-weight: 700; color: #09090b; margin-top: 2px;">{{ selectedDetail.departmentOrGrade || 'N/A' }}</div>
            </div>

            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Date of Departure</div>
              <div style="font-weight: 700; color: #09090b; margin-top: 2px;">
                {{ selectedDetail.departureDate | date:'medium' }}
              </div>
            </div>

            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Email Address</div>
              <div style="font-weight: 600; color: #09090b; margin-top: 2px;">{{ selectedDetail.email || 'None on record' }}</div>
            </div>

            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Phone Number</div>
              <div style="font-weight: 600; color: #09090b; margin-top: 2px;">{{ selectedDetail.phone || 'None on record' }}</div>
            </div>

            <div *ngIf="selectedDetail.entityType === 'STUDENT'">
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Date of Birth & Gender</div>
              <div style="font-weight: 600; color: #09090b; margin-top: 2px;">
                {{ selectedDetail.dateOfBirth || 'N/A' }} • {{ selectedDetail.gender || 'N/A' }}
              </div>
            </div>

            <div *ngIf="selectedDetail.entityType === 'STUDENT'">
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Guardian Information</div>
              <div style="font-weight: 600; color: #09090b; margin-top: 2px;">{{ selectedDetail.guardianInfo || 'N/A' }}</div>
            </div>

            <div *ngIf="selectedDetail.enrollmentOrJoiningDate">
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Original Enrollment / Hire Date</div>
              <div style="font-weight: 600; color: #09090b; margin-top: 2px;">{{ selectedDetail.enrollmentOrJoiningDate }}</div>
            </div>

            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Logged By (Admin)</div>
              <div style="font-weight: 600; color: #09090b; margin-top: 2px;">{{ selectedDetail.deletedBy || 'admin' }}</div>
            </div>
          </div>

          <div *ngIf="selectedDetail.entityType === 'STUDENT' && selectedDetail.address" style="margin-bottom: 20px;">
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Address</div>
            <div style="font-size: 0.9rem; color: #09090b; margin-top: 2px;">{{ selectedDetail.address }}</div>
          </div>

          <div style="margin-bottom: 20px;">
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Previous Classrooms</div>
            <div style="font-size: 0.9rem; color: #09090b; margin-top: 2px; font-weight: 600; background: #f4f4f5; padding: 8px 12px; border-radius: 6px;">
              {{ selectedDetail.previousClassrooms || 'None' }}
            </div>
          </div>

          <div style="margin-bottom: 28px;">
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Exit Reason / Administrative Notes</div>
            <div style="font-size: 0.9rem; color: #09090b; margin-top: 2px; line-height: 1.5; white-space: pre-line; background: #fafafa; border: 1px solid var(--surface-border); padding: 10px 14px; border-radius: 6px;">
              {{ selectedDetail.notes || 'No exit notes recorded.' }}
            </div>
          </div>

          <div style="text-align: right;">
            <button (click)="selectedDetail = null" class="btn btn-secondary">
              Close Record
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminHistoryComponent implements OnInit {
  private apiService = inject(ApiService);

  selectedType: 'STUDENT' | 'TEACHER' = 'STUDENT';
  searchQuery = '';
  currentPage = 0;
  pageSize = 15;
  isLoading = true;

  pageResponse: PageResponse<DepartureHistory> | null = null;
  counts: HistoryCounts = { students: 0, teachers: 0 };
  selectedDetail: DepartureHistory | null = null;

  ngOnInit(): void {
    this.loadHistory();
    this.loadCounts();
  }

  loadHistory(): void {
    this.isLoading = true;
    this.apiService.getDepartureHistory(this.selectedType, this.searchQuery, this.currentPage, this.pageSize).subscribe({
      next: (res: PageResponse<DepartureHistory>) => {
        this.pageResponse = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadCounts(): void {
    this.apiService.getDepartureHistoryCounts().subscribe({
      next: (res: HistoryCounts) => {
        this.counts = res;
      }
    });
  }

  onTypeChange(): void {
    this.currentPage = 0;
    this.searchQuery = '';
    this.loadHistory();
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.loadHistory();
  }

  changePage(newPage: number): void {
    this.currentPage = newPage;
    this.loadHistory();
  }

  openDetailModal(item: DepartureHistory): void {
    this.selectedDetail = item;
  }
}
