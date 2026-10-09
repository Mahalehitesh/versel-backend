import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let t of toastService.toasts()" 
           class="toast" 
           [ngClass]="{'toast-success': t.type === 'success', 'toast-error': t.type === 'error'}">
        <span class="material-icons-outlined">
          {{ t.type === 'success' ? 'check_circle' : (t.type === 'error' ? 'error' : 'info') }}
        </span>
        <span>{{ t.text }}</span>
        <button (click)="toastService.remove(t.id)" style="background:none; border:none; color:inherit; cursor:pointer; margin-left:auto;">
          <span class="material-icons-outlined" style="font-size: 16px;">close</span>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
