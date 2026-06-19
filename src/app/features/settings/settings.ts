import { Component, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService, User } from '../../core/auth/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-surface-foreground dark:text-white">Settings</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm">Manage your profile and preferences.</p>
        </div>
        <button mat-stroked-button color="warn" (click)="logout()">
          <mat-icon>logout</mat-icon> Sign Out
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left: Profile & Theme -->
        <div class="lg:col-span-1 space-y-6">
          
          <!-- Profile Card -->
          <mat-card class="p-6 bg-surface dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div class="text-center">
              <div class="relative inline-block">
                <img 
                  [src]="avatarUrl()" 
                  class="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg mx-auto" 
                  alt="Profile">
                <button mat-mini-fab color="primary" class="absolute bottom-0 right-0" (click)="triggerFileInput()">
                  <mat-icon>edit</mat-icon>
                </button>
                <input #fileInput type="file" (change)="handleFileUpload($event)" accept="image/*" class="hidden">
              </div>
              
              <h3 class="mt-4 text-lg font-bold text-surface-foreground dark:text-white">{{ authService.currentUser()?.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ authService.currentUser()?.email }}</p>
              <span class="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-medium">
                {{ authService.currentUser()?.role }}
              </span>
            </div>
          </mat-card>

          <!-- Theme Card -->
          <mat-card class="p-6 bg-surface dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <h3 class="text-lg font-semibold mb-4 text-surface-foreground dark:text-white flex items-center">
              <mat-icon class="mr-2">palette</mat-icon> Appearance
            </h3>
            <div class="flex items-center justify-between">
              <span class="text-gray-700 dark:text-gray-300">Dark Mode</span>
              <button 
                mat-icon-button 
                [class.text-primary]="isDark()"
                [class.text-gray-400]="!isDark()"
                (click)="toggleTheme()">
                <mat-icon>{{ isDark() ? 'dark_mode' : 'light_mode' }}</mat-icon>
              </button>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Toggle between light and dark themes. Your preference is saved automatically.
            </p>
          </mat-card>
        </div>

        <!-- Right: Forms -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Profile Form -->
          <mat-card class="p-6 bg-surface dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <h3 class="text-lg font-semibold mb-6 text-surface-foreground dark:text-white flex items-center">
              <mat-icon class="mr-2">person</mat-icon> Profile Information
            </h3>
            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Full Name</mat-label>
                  <input matInput formControlName="name" placeholder="John Doe">
                  <mat-error *ngIf="profileForm.get('name')?.hasError('required')">Name is required</mat-error>
                </mat-form-field>
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" type="email" placeholder="john@example.com">
                  <mat-error *ngIf="profileForm.get('email')?.hasError('required')">Email is required</mat-error>
                  <mat-error *ngIf="profileForm.get('email')?.hasError('email')">Invalid email</mat-error>
                </mat-form-field>
              </div>
              <div class="flex justify-end">
                <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || profileForm.pristine">
                  Save Changes
                </button>
              </div>
            </form>
          </mat-card>

          <!-- Notifications -->
          <mat-card class="p-6 bg-surface dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <h3 class="text-lg font-semibold mb-6 text-surface-foreground dark:text-white flex items-center">
              <mat-icon class="mr-2">notifications</mat-icon> Notifications
            </h3>
            <form [formGroup]="notifyForm" class="space-y-4">
              <div class="flex items-center justify-between py-2">
                <div>
                  <h4 class="font-medium text-surface-foreground dark:text-white">Email Notifications</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Receive emails about your account activity.</p>
                </div>
                <mat-checkbox formControlName="emailNotifs" color="primary"></mat-checkbox>
              </div>
              <mat-divider></mat-divider>
              <div class="flex items-center justify-between py-2">
                <div>
                  <h4 class="font-medium text-surface-foreground dark:text-white">Marketing Emails</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Receive emails about new features and updates.</p>
                </div>
                <mat-checkbox formControlName="marketingNotifs" color="primary"></mat-checkbox>
              </div>
              <div class="flex justify-end pt-4">
                <button mat-raised-button color="primary" type="button" (click)="saveNotifications()" [disabled]="notifyForm.pristine">
                  Save Preferences
                </button>
              </div>
            </form>
          </mat-card>

        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  public authService = inject(AuthService);

  // Theme Signal (Persistent)
  isDark = signal<boolean>(false);

  // Forms
  profileForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  notifyForm = this.fb.group({
    emailNotifs: [true],
    marketingNotifs: [false]
  });

  avatarUrl = signal<string>('');

  constructor() {
    // Load initial theme
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      const isDarkMode = savedTheme === 'dark';
      this.isDark.set(isDarkMode);
      this.updateThemeClass(isDarkMode);

      // Load user data into form
      const user = this.authService.currentUser();
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        });
        this.avatarUrl.set(`https://ui-avatars.com/api/?name=${user.name}&background=0284c7&color=fff&size=128`);
      }
    }
  }

  // Theme Logic
  toggleTheme() {
    this.isDark.update(v => !v);
    const isDark = this.isDark();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
    this.updateThemeClass(isDark);
  }

  private updateThemeClass(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Profile Logic
  saveProfile() {
    if (this.profileForm.valid) {
      const { name, email } = this.profileForm.value as { name: string; email: string };

      // Simulate API call
      this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
      this.profileForm.markAsPristine();

      // In a real app, update the user via AuthService
      const user = this.authService.currentUser();
      if (user) {
        const updatedUser: User = {
          ...user,
          name: name || user.name, // Fallback to current name if somehow null
          email: email || user.email
        };

        // Access the private signal for demo purposes (or make it public via a method)
        this.authService['userSignal'].set(updatedUser);

        this.avatarUrl.set(`https://ui-avatars.com/api/?name=${updatedUser.name}&background=0284c7&color=fff&size=128`);
      }
    }
  }

  // Notifications Logic
  saveNotifications() {
    this.snackBar.open('Notification preferences saved!', 'Close', { duration: 3000 });
    this.notifyForm.markAsPristine();
  }

  // File Upload Logic
  triggerFileInput() {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      input.click();
    }
  }

  handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file: any = input.files;

      const reader = new FileReader();

      reader.onload = (e) => {
        this.avatarUrl.set(e.target?.result as string);
        this.snackBar.open('Avatar updated!', 'Close', { duration: 3000 });
      };

      reader.readAsDataURL(file);
    }
  }

  logout() {
    if (confirm('Are you sure you want to sign out?')) {
      this.authService.logout();
    }
  }
}