import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { TeacherDashboardResponse, Classroom } from '../../../models/classroom.model';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px 40px;">
      <!-- Page Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px;">
        <div>
          <h2 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px; color: #09090b;">Teacher Dashboard</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Overview of your assigned classrooms organized by academic terms</p>
        </div>
        <button (click)="loadDashboard()" class="btn btn-secondary btn-sm">
          <span class="material-icons-outlined">refresh</span> Refresh
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" style="display: flex; justify-content: center; padding: 60px;">
        <div class="spinner" style="width: 40px; height: 40px;"></div>
      </div>

      <ng-container *ngIf="!isLoading && dashboard">
        <!-- 1. Current Term Section -->
        <section style="margin-bottom: 40px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
            <span class="badge badge-current">Current Term</span>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #09090b;">Active Classrooms</h3>
          </div>

          <div *ngIf="dashboard.currentTermClassrooms.length === 0" class="glass-panel" style="padding: 32px; text-align: center; color: var(--text-muted);">
            No active classrooms assigned for the current term.
          </div>

          <div class="grid-layout">
            <div *ngFor="let c of dashboard.currentTermClassrooms" [routerLink]="['/teacher/classrooms', c.id, 'students']" class="glass-card classroom-card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <span class="badge badge-current">{{ c.term.name }}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">{{ c.roomNumber }}</span>
              </div>
              <h4 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 4px; color: #09090b;">{{ c.name }}</h4>
              <div style="color: #71717a; font-size: 0.875rem; font-weight: 600; margin-bottom: 16px;">
                {{ c.subject }} • {{ c.gradeSection }}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--surface-border); font-size: 0.85rem; color: var(--text-muted);">
                <span style="display: flex; align-items: center; gap: 6px;">
                  <span class="material-icons-outlined" style="font-size: 18px;">groups</span>
                  {{ c.studentCount }} Students
                </span>
                <span style="color: #09090b; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                  View Class <span class="material-icons-outlined" style="font-size: 16px;">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Future Terms Section (Appears ONLY if classrooms exist) -->
        <section *ngIf="dashboard.futureTermClassrooms && dashboard.futureTermClassrooms.length > 0" style="margin-bottom: 40px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
            <span class="badge badge-future">Upcoming</span>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #09090b;">Future Terms</h3>
          </div>

          <div class="grid-layout">
            <div *ngFor="let c of dashboard.futureTermClassrooms" [routerLink]="['/teacher/classrooms', c.id, 'students']" class="glass-card classroom-card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <span class="badge badge-future">{{ c.term.name }}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">{{ c.roomNumber }}</span>
              </div>
              <h4 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 4px; color: #09090b;">{{ c.name }}</h4>
              <div style="color: #71717a; font-size: 0.875rem; font-weight: 600; margin-bottom: 16px;">
                {{ c.subject }} • {{ c.gradeSection }}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--surface-border); font-size: 0.85rem; color: var(--text-muted);">
                <span style="display: flex; align-items: center; gap: 6px;">
                  <span class="material-icons-outlined" style="font-size: 18px;">groups</span>
                  {{ c.studentCount }} Students
                </span>
                <span style="color: #09090b; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                  View Class <span class="material-icons-outlined" style="font-size: 16px;">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- 3. Previous Terms Section -->
        <section style="margin-bottom: 40px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
            <span class="badge badge-past">Archive</span>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #09090b;">Previous Terms</h3>
          </div>

          <div *ngIf="dashboard.previousTermClassrooms.length === 0" class="glass-panel" style="padding: 24px; text-align: center; color: var(--text-muted);">
            No past classrooms in history.
          </div>

          <div class="grid-layout">
            <div *ngFor="let c of dashboard.previousTermClassrooms" [routerLink]="['/teacher/classrooms', c.id, 'students']" class="glass-card classroom-card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <span class="badge badge-past">{{ c.term.name }}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">{{ c.roomNumber }}</span>
              </div>
              <h4 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 4px; color: #09090b;">{{ c.name }}</h4>
              <div style="color: var(--text-muted); font-size: 0.875rem; font-weight: 600; margin-bottom: 16px;">
                {{ c.subject }} • {{ c.gradeSection }}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--surface-border); font-size: 0.85rem; color: var(--text-muted);">
                <span style="display: flex; align-items: center; gap: 6px;">
                  <span class="material-icons-outlined" style="font-size: 18px;">groups</span>
                  {{ c.studentCount }} Students
                </span>
                <span style="color: #09090b; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                  View Class <span class="material-icons-outlined" style="font-size: 16px;">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </ng-container>
    </div>
  `,
  styles: [`
    .grid-layout {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }
    .classroom-card {
      padding: 20px;
      cursor: pointer;
    }
  `]
})
export class TeacherDashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  dashboard: TeacherDashboardResponse | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.apiService.getTeacherDashboard().subscribe({
      next: (res: TeacherDashboardResponse) => {
        this.dashboard = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
