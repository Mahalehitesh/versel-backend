import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { AuthResponse } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div class="glass-panel" style="width: 100%; max-width: 440px; padding: 40px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="width: 56px; height: 56px; background: #09090b; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; box-shadow: var(--shadow-glow);">
            <span class="material-icons-outlined" style="font-size: 32px; color: white;">school</span>
          </div>
          <h2 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px; color: #09090b;">Welcome Back</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 6px;">Sign in to access your classroom management portal</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input type="text" formControlName="username" class="form-input" placeholder="Enter username (e.g. admin or t_smith)">
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" formControlName="password" class="form-input" placeholder="••••••••">
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading" class="btn btn-primary" style="width: 100%; padding: 14px; margin-top: 12px;">
            <div *ngIf="isLoading" class="spinner"></div>
            <span *ngIf="!isLoading">Sign In</span>
          </button>
        </form>

        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--surface-border); font-size: 0.825rem; color: var(--text-muted);">
          <strong>Demo Credentials:</strong><br>
          • <code>admin</code> / <code>admin123</code> (Admin Role)<br>
          • <code>t_smith</code> / <code>password123</code> (Teacher Role)
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isLoading = false;

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;

    this.authService.login(this.loginForm.value as any).subscribe({
      next: (res: AuthResponse) => {
        this.isLoading = false;
        this.toastService.success(`Welcome back, ${res.fullName}!`);
        if (res.role === 'ADMIN') {
          this.router.navigate(['/admin/classrooms']);
        } else {
          this.router.navigate(['/teacher/dashboard']);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.toastService.error(err.error?.message || 'Invalid username or password');
      }
    });
  }
}
