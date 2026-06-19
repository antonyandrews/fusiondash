import { Component, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class LayoutComponent {
  private platformId = inject(PLATFORM_ID);

  // Signals for state management (Angular 21 Style)
  isDark = signal<boolean>(false);
  isDesktop = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Set initial value
      this.isDesktop.set(window.innerWidth >= 1024);

      // Add resize listener
      const handleResize = () => {
        this.isDesktop.set(window.innerWidth >= 1024);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup on destroy (optional but good practice)
      // You might need to implement OnDestroy to remove the listener
    }
  }

  navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'analytics' },
    { label: 'Users', path: '/users', icon: 'people' },
    { label: 'Settings', path: '/settings', icon: 'settings' },
    { label: 'Pricing', path: '/pricing', icon: 'attach_money' },
  ];

  toggleSidenav() {
    // Logic handled by #sidenav reference in template
    const sidenav = document.querySelector('mat-sidenav') as any;
    if (sidenav) sidenav.toggle();
  }

  toggleTheme() {
    this.isDark.update(v => !v);
    if (this.isDark()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}