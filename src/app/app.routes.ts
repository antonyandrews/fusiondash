import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: '',
        loadComponent: () => import('./shared/layout/layout').then(l => l.LayoutComponent),
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent) },
            { path: 'users', loadComponent: () => import('./features/users/users').then(m => m.UsersComponent) },
            { path: 'settings', loadComponent: () => import('./features/settings/settings').then(m => m.SettingsComponent) },
            { path: 'pricing', loadComponent: () => import('./features/pricing/pricing').then(m => m.PricingComponent) },
            //     { path: '**', loadComponent: () => import('./features/404/not-found.component').then(m => m.NotFoundComponent) },
        ]
    },
    { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) },
    // { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
];