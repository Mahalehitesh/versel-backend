import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar.component';
import { ToastComponent } from './components/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, ToastComponent],
  template: `
    <div style="min-height: 100vh; display: flex; flex-direction: column;">
      <app-navbar></app-navbar>
      <main style="flex: 1;">
        <router-outlet></router-outlet>
      </main>
      <app-toast></app-toast>
    </div>
  `
})
export class AppComponent {}
