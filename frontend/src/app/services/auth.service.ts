import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AuthResponse, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';

  currentUser = signal<User | null>(this.getUserFromStorage());
  token = signal<string | null>(localStorage.getItem('token'));

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        this.setSession(res);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap(res => {
        this.setSession(res);
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.token.set(null);
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  isTeacher(): boolean {
    return this.currentUser()?.role === 'TEACHER';
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('refreshToken', authResult.refreshToken);
    const user: User = {
      id: authResult.id,
      username: authResult.username,
      email: authResult.email,
      fullName: authResult.fullName,
      role: authResult.role
    };
    localStorage.setItem('user', JSON.stringify(user));
    this.token.set(authResult.token);
    this.currentUser.set(user);
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
}
