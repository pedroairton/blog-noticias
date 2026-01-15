import { Injectable, PLATFORM_ID } from '@angular/core';
import { ApiService } from './api.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Admin, LoginRequest, LoginResponse } from '../models/admin.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService)
  private router = inject(Router)
  private platformId = inject(PLATFORM_ID)

  private currentAdminSubject = new BehaviorSubject<Admin | null>(null)
  private tokenSubject = new BehaviorSubject<string | null>(null)

  currentAdmin$ = this.currentAdminSubject.asObservable()
  token$ = this.tokenSubject.asObservable()

  constructor() { 
    this.loadFromStorage()
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('auth/login', credentials).pipe(
      tap((response: LoginResponse) => {
        this.setSession(response)
        this.router.navigate(['/admin/dashboard'])
      })
    )
  }

  logout(): void {
    this.api.post('auth/logout', {}).subscribe()
    this.clearSession()
    this.router.navigate(['/login'])
  }

  getCurrentUser(): Observable<Admin | null> {
    return this.api.get<Admin>('auth/me')
  }

  refreshToken(): Observable<any> {
    return this.api.post('auth/refresh', {}).pipe(
      tap((response: any) => {
        this.tokenSubject.next(response.token)
        if(this.isBrowser){
          localStorage.setItem('auth_token', response.token)
        }
      })
    )
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value
  }

  isSuperAdmin(): boolean {
    return this.currentAdminSubject.value?.role === 'superadmin'
  }

  isAuthor(): boolean {
    return this.currentAdminSubject.value?.role === 'author'
  }

  private setSession(response: LoginResponse): void {
    if(this.isBrowser){
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('current_admin', JSON.stringify(response.admin))
    }
    this.tokenSubject.next(response.token)
    this.currentAdminSubject.next(response.admin)
  }

  private clearSession(): void {
    if(this.isBrowser){
      localStorage.removeItem('auth_token')
      localStorage.removeItem('current_admin')
    }
    this.tokenSubject.next(null)
    this.currentAdminSubject.next(null)
  }

  loadFromStorage() {
    if(this.isBrowser){
      const token = localStorage.getItem('auth_token')
      const admin = localStorage.getItem('current_admin')

      if(token) {
        this.tokenSubject.next(token)
      }
      if(admin) {
        this.currentAdminSubject.next(JSON.parse(admin))
      }
    }
  }
  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId)
  }

  // users
  changePassword(passwords: { current_password: string, new_password: string, new_password_confirmation: string }): Observable<any> {
    return this.api.put('profile/password', passwords)
  }
  updateProfile(formData: FormData) {
    console.log('updateProfile');
    
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
      }
    return this.api.post('profile', formData)
  }
}
