import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="glass-panel" style="border-radius:0; border-x:none; border-top:none; margin-bottom: 24px; background: #ffffff; border-bottom: 1px solid #e4e4e7;">
      <div style="max-width: 1280px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 38px; height: 38px; background: #09090b; color: #ffffff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px;">
            S
          </div>
          <div>
            <h1 style="font-size: 1.1rem; font-weight: 800; letter-spacing: -0.5px; margin:0; color: #09090b;">EduClass OS</h1>
            <span style="font-size: 0.75rem; color: var(--text-muted);">School Classroom Portal</span>
          </div>
        </div>

        <nav *ngIf="authService.currentUser()" style="display: flex; align-items: center; gap: 16px;">
          <!-- Teacher Navigation -->
          <ng-container *ngIf="authService.isTeacher()">
            <a routerLink="/teacher/dashboard" routerLinkActive="active-link" class="nav-item">
              <span class="material-icons-outlined">dashboard</span>
              Dashboard
            </a>
          </ng-container>

          <!-- Admin Navigation -->
          <ng-container *ngIf="authService.isAdmin()">
            <a routerLink="/admin/classrooms" routerLinkActive="active-link" class="nav-item">
              <span class="material-icons-outlined">meeting_room</span>
              Classrooms
            </a>
            <a routerLink="/admin/terms" routerLinkActive="active-link" class="nav-item">
              <span class="material-icons-outlined">date_range</span>
              Terms
            </a>
            <a routerLink="/admin/teachers" routerLinkActive="active-link" class="nav-item">
              <span class="material-icons-outlined">badge</span>
              Teachers
            </a>
            <a routerLink="/admin/students" routerLinkActive="active-link" class="nav-item">
              <span class="material-icons-outlined">groups</span>
              Students
            </a>
            <a routerLink="/teacher/dashboard" routerLinkActive="active-link" class="nav-item">
              <span class="material-icons-outlined">visibility</span>
              Teacher View
            </a>
          </ng-container>

          <!-- User Profile & Logout -->
          <div style="display: flex; align-items: center; gap: 12px; margin-left: 12px; padding-left: 16px; border-left: 1px solid var(--surface-border);">
            <div style="text-align: right;">
              <div style="font-size: 0.85rem; font-weight: 700; color: #09090b;">{{ authService.currentUser()?.fullName }}</div>
              <div class="badge" [ngClass]="authService.isAdmin() ? 'badge-future' : 'badge-current'" style="font-size: 0.65rem; padding: 2px 6px;">
                {{ authService.currentUser()?.role }}
              </div>
            </div>
            <button (click)="authService.logout()" class="btn btn-secondary btn-sm" title="Sign Out">
              <span class="material-icons-outlined">logout</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .nav-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      transition: all 0.2s ease;
    }
    .nav-item:hover {
      color: #09090b;
      background: #f4f4f5;
    }
    .active-link {
      color: #09090b !important;
      background: #f4f4f5 !important;
      border: 1px solid #e4e4e7;
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
}
