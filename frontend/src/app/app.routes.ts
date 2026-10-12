import { Routes } from '@angular/router';
import { adminGuard, authGuard, teacherGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'teacher/dashboard',
    canActivate: [teacherGuard],
    loadComponent: () => import('./pages/teacher/dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent)
  },
  {
    path: 'teacher/classrooms/:id/students',
    canActivate: [teacherGuard],
    loadComponent: () => import('./pages/teacher/classroom-students/classroom-students.component').then(m => m.ClassroomStudentsComponent)
  },
  {
    path: 'teacher/students/:id',
    canActivate: [teacherGuard],
    loadComponent: () => import('./pages/teacher/student-detail/student-detail.component').then(m => m.StudentDetailComponent)
  },
  {
    path: 'admin/terms',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/terms/admin-terms.component').then(m => m.AdminTermsComponent)
  },
  {
    path: 'admin/classrooms',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/classrooms/admin-classrooms.component').then(m => m.AdminClassroomsComponent)
  },
  {
    path: 'admin/teachers',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/teachers/admin-teachers.component').then(m => m.AdminTeachersComponent)
  },
  {
    path: 'admin/students',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/students/admin-students.component').then(m => m.AdminStudentsComponent)
  },
  {
    path: 'admin/history',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/history/admin-history.component').then(m => m.AdminHistoryComponent)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
