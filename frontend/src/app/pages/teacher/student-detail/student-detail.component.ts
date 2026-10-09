import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { StudentDetail } from '../../../models/student.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="max-width: 1000px; margin: 0 auto; padding: 0 24px 40px;">
      <!-- Back Navigation -->
      <div style="margin-bottom: 20px;">
        <button (click)="goBack()" style="background:none; border:none; color: var(--text-muted); cursor:pointer; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 6px;">
          <span class="material-icons-outlined" style="font-size: 16px;">arrow_back</span> Back
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" style="display: flex; justify-content: center; padding: 60px;">
        <div class="spinner" style="width: 40px; height: 40px;"></div>
      </div>

      <ng-container *ngIf="!isLoading && student">
        <!-- Main Student Profile Header Card -->
        <div class="glass-panel" style="padding: 32px; margin-bottom: 24px; background: #ffffff;">
          <div style="display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap;">
            <div style="width: 80px; height: 80px; background: #09090b; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 800; color: white; box-shadow: var(--shadow-glow);">
              {{ student.firstName ? student.firstName.charAt(0) : '' }}{{ student.lastName ? student.lastName.charAt(0) : '' }}
            </div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
                <span class="badge badge-current" style="font-family: monospace;">ROLL: {{ student.rollNumber }}</span>
                <span class="badge badge-future">{{ student.grade }}</span>
              </div>
              <h2 style="font-size: 2rem; font-weight: 800; letter-spacing: -0.5px; color: #09090b;">{{ student.fullName }}</h2>
              <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">Enrolled on: {{ student.enrollmentDate }}</p>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 24px;">
          <!-- Personal & Contact Info -->
          <div class="glass-panel" style="padding: 24px; background: #ffffff;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; border-bottom: 1px solid var(--surface-border); padding-bottom: 10px; display: flex; align-items: center; gap: 8px; color: #09090b;">
              <span class="material-icons-outlined" style="color: #09090b;">person</span>
              Personal Information
            </h3>
            <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem;">
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; text-transform: uppercase;">Date of Birth</span>
                <strong style="color: var(--text-main);">{{ student.dateOfBirth }}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; text-transform: uppercase;">Gender</span>
                <strong style="color: var(--text-main);">{{ student.gender }}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; text-transform: uppercase;">Student Email</span>
                <strong style="color: #09090b;">{{ student.contactEmail || 'N/A' }}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; text-transform: uppercase;">Student Phone</span>
                <strong style="color: var(--text-main);">{{ student.contactPhone || 'N/A' }}</strong>
              </div>
            </div>
          </div>

          <!-- Guardian & Address Info -->
          <div class="glass-panel" style="padding: 24px; background: #ffffff;">
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; border-bottom: 1px solid var(--surface-border); padding-bottom: 10px; display: flex; align-items: center; gap: 8px; color: #09090b;">
              <span class="material-icons-outlined" style="color: #09090b;">family_restroom</span>
              Guardian & Contact Details
            </h3>
            <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem;">
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; text-transform: uppercase;">Guardian Name</span>
                <strong style="color: var(--text-main);">{{ student.guardianName }}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; text-transform: uppercase;">Guardian Phone</span>
                <strong style="color: #09090b;">{{ student.guardianPhone }}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; text-transform: uppercase;">Residential Address</span>
                <strong style="color: var(--text-main);">{{ student.address }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Enrolled Classrooms Section -->
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px; background: #ffffff;">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; border-bottom: 1px solid var(--surface-border); padding-bottom: 10px; display: flex; align-items: center; gap: 8px; color: #09090b;">
            <span class="material-icons-outlined" style="color: #09090b;">school</span>
            Enrolled Classrooms
          </h3>
          <div *ngIf="!student.classrooms || student.classrooms.length === 0" style="color: var(--text-muted); font-size: 0.9rem;">
            Student is not currently assigned to any classroom.
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
            <div *ngFor="let c of student.classrooms || []" class="glass-card" style="padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span class="badge" [ngClass]="getBadgeClass(c.termStatus)">{{ c.termName }}</span>
                <span style="font-size: 0.775rem; color: var(--text-muted);">Rm {{ c.roomNumber }}</span>
              </div>
              <h4 style="font-size: 1rem; font-weight: 700; color: #09090b;">{{ c.name }}</h4>
              <div style="font-size: 0.825rem; color: #71717a; font-weight: 600; margin-top: 4px;">
                {{ c.subject }} ({{ c.gradeSection }})
              </div>
            </div>
          </div>
        </div>

        <!-- Teacher / Administrative Notes -->
        <div *ngIf="student.notes" class="glass-panel" style="padding: 24px; background: #ffffff;">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; color: #09090b;">
            <span class="material-icons-outlined" style="color: #09090b;">description</span>
            Administrative Notes
          </h3>
          <p style="color: var(--text-muted); font-size: 0.925rem; line-height: 1.6; white-space: pre-line;">
            {{ student.notes }}
          </p>
        </div>
      </ng-container>
    </div>
  `
})
export class StudentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private location = inject(Location);

  studentId!: number;
  student: StudentDetail | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadStudentDetail();
  }

  loadStudentDetail(): void {
    this.isLoading = true;
    const request$ = this.authService.isTeacher()
      ? this.apiService.getTeacherStudentDetail(this.studentId)
      : this.apiService.getStudentDetail(this.studentId);

    request$.subscribe({
      next: (res: StudentDetail) => {
        this.student = res;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  getBadgeClass(status: string): string {
    if (status === 'CURRENT') return 'badge-current';
    if (status === 'FUTURE') return 'badge-future';
    return 'badge-past';
  }
}
