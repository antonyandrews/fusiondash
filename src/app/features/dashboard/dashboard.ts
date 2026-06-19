import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

// You will install apexcharts later: npm install apexcharts
// For now, we use a placeholder or simple SVG for the demo

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinner],
  templateUrl: `./dashboard.html`
})
export class DashboardComponent implements OnInit {
  stats = signal([
    { label: 'Total Revenue', value: '$45,231', trend: 12.5, icon: 'attach_money' },
    { label: 'Active Users', value: '2,345', trend: 8.2, icon: 'people' },
    { label: 'Bounce Rate', value: '24.5%', trend: -3.1, icon: 'trending_down' },
    { label: 'Avg. Session', value: '4m 32s', trend: 5.4, icon: 'timer' },
  ]);

  ngOnInit() {
    // Simulate data fetching
    console.log('Dashboard loaded with Signals');
  }
}