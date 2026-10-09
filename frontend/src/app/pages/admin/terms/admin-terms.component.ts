import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ToastService } from '../../../services/toast.service';
import { Term } from '../../../models/term.model';

@Component({
  selector: 'app-admin-terms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px 40px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
        <div>
          <h2 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px;">Manage Academic Terms</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Create and edit school terms. Statuses (Past, Current, Future) are calculated dynamically.</p>
        </div>
        <button (click)="openModal()" class="btn btn-primary">
          <span class="material-icons-outlined">add</span> Create Term
        </button>
      </div>

      <div class="table-container glass-panel">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Term Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="isLoading">
              <td colspan="6" style="text-align: center; padding: 40px;"><div class="spinner" style="margin: 0 auto;"></div></td>
            </tr>
            <tr *ngFor="let t of terms">
              <td>#{{ t.id }}</td>
              <td style="font-weight: 700;">{{ t.name }}</td>
              <td>{{ t.startDate }}</td>
              <td>{{ t.endDate }}</td>
              <td>
                <span class="badge" [ngClass]="getBadgeClass(t.status)">{{ t.status }}</span>
              </td>
              <td style="text-align: right;">
                <button (click)="openModal(t)" class="btn btn-secondary btn-sm" style="margin-right: 8px;">Edit</button>
                <button (click)="deleteTerm(t.id)" class="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create / Edit Modal -->
      <div *ngIf="isModalOpen" class="modal-backdrop">
        <div class="modal-content">
          <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 20px;">
            {{ editingTermId ? 'Edit Term' : 'Create New Term' }}
          </h3>
          <form [formGroup]="termForm" (ngSubmit)="saveTerm()">
            <div class="form-group">
              <label class="form-label">Term Name</label>
              <input type="text" formControlName="name" class="form-input" placeholder="e.g. Fall 2026">
            </div>
            <div class="form-group">
              <label class="form-label">Start Date</label>
              <input type="date" formControlName="startDate" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">End Date</label>
              <input type="date" formControlName="endDate" class="form-input">
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
              <button type="button" (click)="closeModal()" class="btn btn-secondary">Cancel</button>
              <button type="submit" [disabled]="termForm.invalid" class="btn btn-primary">Save Term</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminTermsComponent implements OnInit {
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  terms: Term[] = [];
  isLoading = true;
  isModalOpen = false;
  editingTermId: number | null = null;

  termForm = this.fb.group({
    name: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadTerms();
  }

  loadTerms(): void {
    this.isLoading = true;
    this.apiService.getTerms().subscribe({
      next: (res: Term[]) => {
        this.terms = res;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  openModal(term?: Term): void {
    if (term) {
      this.editingTermId = term.id;
      this.termForm.patchValue({
        name: term.name,
        startDate: term.startDate,
        endDate: term.endDate
      });
    } else {
      this.editingTermId = null;
      this.termForm.reset();
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveTerm(): void {
    if (this.termForm.invalid) return;
    const val = this.termForm.value as any;

    if (this.editingTermId) {
      this.apiService.updateTerm(this.editingTermId, val).subscribe({
        next: () => {
          this.toastService.success('Term updated successfully');
          this.closeModal();
          this.loadTerms();
        },
        error: (err: any) => this.toastService.error(err.error?.message || 'Failed to update term')
      });
    } else {
      this.apiService.createTerm(val).subscribe({
        next: () => {
          this.toastService.success('Term created successfully');
          this.closeModal();
          this.loadTerms();
        },
        error: (err: any) => this.toastService.error(err.error?.message || 'Failed to create term')
      });
    }
  }

  deleteTerm(id: number): void {
    if (!confirm('Are you sure you want to delete this term? All associated classrooms will be deleted.')) return;
    this.apiService.deleteTerm(id).subscribe({
      next: () => {
        this.toastService.success('Term deleted');
        this.loadTerms();
      },
      error: (err: any) => this.toastService.error(err.error?.message || 'Failed to delete term')
    });
  }

  getBadgeClass(status: string): string {
    if (status === 'CURRENT') return 'badge-current';
    if (status === 'FUTURE') return 'badge-future';
    return 'badge-past';
  }
}
