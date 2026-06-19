import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  cta: string;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  templateUrl: './pricing.html',
  styleUrls: ['./pricing.scss']
})
export class PricingComponent {
  isYearly = signal<boolean>(false);

  plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      priceMonthly: 0,
      priceYearly: 0,
      description: 'Essential tools for individuals.',
      features: ['3 Projects', 'Basic Analytics', 'Community Support'],
      cta: 'Get Started Free'
    },
    {
      id: 'pro',
      name: 'Pro',
      priceMonthly: 29,
      priceYearly: 24,
      description: 'Perfect for growing teams.',
      features: [
        'Unlimited Projects',
        'Advanced Analytics',
        'Priority Support',
        '100GB Storage',
        '5 Team Members'
      ],
      isPopular: true,
      cta: 'Start 14-Day Trial'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      priceMonthly: 99,
      priceYearly: 79,
      description: 'Advanced security for large orgs.',
      features: [
        'Everything in Pro',
        'Dedicated Manager',
        '24/7 Phone Support',
        'SSO & Audit Logs',
        'Custom SLA'
      ],
      cta: 'Contact Sales'
    }
  ];

  getDisplayPrice(plan: Plan): number {
    return this.isYearly() ? plan.priceYearly : plan.priceMonthly;
  }

  getAnnualSavings(plan: Plan): number {
    if (!this.isYearly() || plan.priceMonthly === 0) return 0;
    return (plan.priceMonthly - plan.priceYearly) * 12;
  }

  toggleYearly(event: any) {
    this.isYearly.set(event.checked);
  }
}