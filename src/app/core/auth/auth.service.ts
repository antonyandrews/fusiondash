import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, delay, of } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSignal = signal<User | null>(null);
  public isAuthenticated = computed(() => !!this.userSignal());
  public currentUser = computed(() => this.userSignal());
  public isLoading = signal<boolean>(false);

  private platformId = inject(PLATFORM_ID);
  private router = inject(Router); // Inject Router here to avoid circular dependency issues if any

  constructor() {
    // ✅ FIX: Only access localStorage if we are in the browser
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('mock_user');
      if (savedUser) {
        try {
          this.userSignal.set(JSON.parse(savedUser));
        } catch (e) {
          console.error('Failed to parse saved user', e);
          localStorage.removeItem('mock_user');
        }
      }
    }
  }

  login(email: string, password: string) {
    this.isLoading.set(true);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@demo.com' && password === 'password') {
          const user: User = {
            id: 1,
            name: 'Demo Admin',
            email: email,
            role: 'Admin'
          };
          
          this.userSignal.set(user);
          
          // ✅ FIX: Save to localStorage only in browser
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('mock_user', JSON.stringify(user));
          }
          
          this.isLoading.set(false);
          resolve(user);
        } else {
          this.isLoading.set(false);
          reject('Invalid credentials');
        }
      }, 1000);
    });
  }

  logout() {
    this.userSignal.set(null);
    
    // ✅ FIX: Remove from localStorage only in browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('mock_user');
    }
    
    this.router.navigate(['/login']);
  }
}