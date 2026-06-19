import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatInputModule, MatCardModule,
    MatButtonModule, MatIconModule, MatCheckboxModule, MatSnackBarModule, RouterLink, MatProgressSpinnerModule
  ],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0f172a] p-4">
      <mat-card class="w-full max-w-md p-8 shadow-xl rounded-2xl bg-surface dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <mat-icon class="text-primary text-4xl">dashboard</mat-icon>
          </div>
          <h2 class="text-2xl font-bold text-surface-foreground dark:text-white">Welcome Back</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Sign in to access your dashboard</p>
        </div>

        <!-- Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Email Address</mat-label>
            <input matInput formControlName="email" type="email" placeholder="admin@demo.com" autocomplete="email">
            <mat-icon matPrefix>email</mat-icon>
            <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
            <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Invalid email format</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" type="password" placeholder="••••••••" autocomplete="current-password">
            <mat-icon matPrefix>lock</mat-icon>
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
          </mat-form-field>

          <div class="flex items-center justify-between">
            <mat-checkbox formControlName="rememberMe" class="text-sm">
              <span class="text-gray-600 dark:text-gray-300">Remember me</span>
            </mat-checkbox>
            <a href="#" class="text-sm text-primary hover:underline">Forgot password?</a>
          </div>

          <button 
            mat-raised-button 
            color="primary" 
            type="submit" 
            class="w-full py-3 text-lg font-semibold"
            [disabled]="loginForm.invalid || authService.isLoading()">
            
            @if (authService.isLoading()) {
              <mat-spinner diameter="20" class="mr-2"></mat-spinner>
              Signing in...
            } @else {
              Sign In
            }
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-6 text-center">
          <p class="text-gray-600 dark:text-gray-400">
            Don't have an account? 
            <a [routerLink]="['/register']" class="text-primary font-medium hover:underline">Sign up</a>
          </p>
          <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <p class="text-xs text-blue-800 dark:text-blue-300 font-medium">Demo Credentials:</p>
            <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">Email: <span class="font-mono">admin@demo.com</span></p>
            <p class="text-xs text-blue-600 dark:text-blue-400">Pass: <span class="font-mono">password</span></p>
          </div>
        </div>

      </mat-card>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .mat-mdc-card { border-radius: 16px; }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper { font-size: 0.875rem; }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  redirectUrl = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Check for redirect URL
    this.route.queryParams.subscribe(params => {
      this.redirectUrl = params['redirect'] || '/dashboard';
    });
  }

  onSubmit() {
    if (this.loginForm.valid && !this.authService.isLoading()) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password)
        .then(() => {
          this.snackBar.open('Login successful!', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          this.router.navigate([this.redirectUrl]);
        })
        .catch((error) => {
          this.snackBar.open(error, 'Error', { duration: 3000, panelClass: ['error-snackbar'] });
        });
    }
  }
}