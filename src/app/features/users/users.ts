import { Component, signal, computed, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select'; // ✅ Added
import { MatOptionModule } from '@angular/material/core';   // ✅ Added
import { MatCardModule } from '@angular/material/card';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog';

// --- Interfaces ---
interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

// --- Mock Data ---
const MOCK_USERS: User[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? 'Admin' : i % 2 === 0 ? 'Editor' : 'Viewer',
  status: i % 5 === 0 ? 'Inactive' : 'Active',
  lastLogin: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
}));

// --- Main Users Component ---
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, 
    MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, 
    MatIconModule, MatMenuModule, MatCardModule, MatSelectModule, MatOptionModule, EditUserDialogComponent
  ],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-surface-foreground dark:text-white">User Management</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm">Manage users, roles, and permissions.</p>
        </div>
        <button mat-raised-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon> Add User
        </button>
      </div>

      <!-- Search & Filters -->
      <div class="flex flex-col md:flex-row gap-4 bg-surface dark:bg-gray-900 p-4 rounded-lg shadow-soft border border-gray-200 dark:border-gray-800">
        <mat-form-field appearance="outline" class="flex-1">
          <mat-label>Search Users</mat-label>
          <input matInput (input)="searchTerm.set($any($event.target).value)" placeholder="Name or email...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full md:w-48">
          <mat-label>Role</mat-label>
          <mat-select (selectionChange)="filterRole.set($event.value)">
            <mat-option value="">All Roles</mat-option>
            <mat-option value="Admin">Admin</mat-option>
            <mat-option value="Editor">Editor</mat-option>
            <mat-option value="Viewer">Viewer</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full md:w-48">
          <mat-label>Status</mat-label>
          <mat-select (selectionChange)="filterStatus.set($event.value)">
            <mat-option value="">All Statuses</mat-option>
            <mat-option value="Active">Active</mat-option>
            <mat-option value="Inactive">Inactive</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Data Table -->
      <mat-card class="overflow-hidden shadow-soft bg-surface dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="paginatedUsers()" class="w-full" matSort (matSortChange)="sortData($event)">
            
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
              <td mat-cell *matCellDef="let user">{{ user.id }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
              <td mat-cell *matCellDef="let user" class="font-medium">
                <div class="flex items-center">
                  <img src="https://ui-avatars.com/api/?name={{user.name}}&background=0284c7&color=fff&size=32" class="w-8 h-8 rounded-full mr-3">
                  {{ user.name }}
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
              <td mat-cell *matCellDef="let user" class="text-sm">{{ user.email }}</td>
            </ng-container>

            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
              <td mat-cell *matCellDef="let user">
                <span [ngClass]="{'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': user.role === 'Admin', 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300': user.role === 'Editor', 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': user.role === 'Viewer'}" class="px-2 py-1 rounded-full text-xs font-medium">{{ user.role }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
              <td mat-cell *matCellDef="let user">
                <span [ngClass]="{'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': user.status === 'Active', 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': user.status === 'Inactive'}" class="px-2 py-1 rounded-full text-xs font-medium">{{ user.status }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="text-right">Actions</th>
              <td mat-cell *matCellDef="let user" class="text-right">
                <button mat-icon-button [matMenuTriggerFor]="menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="openEditDialog(user)">
                    <mat-icon class="text-blue-600">edit</mat-icon> Edit
                  </button>
                  <button mat-menu-item (click)="deleteUser(user.id)" class="text-red-600">
                    <mat-icon>delete</mat-icon> Delete
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        <mat-paginator 
          [length]="filteredUsers().length" 
          [pageSize]="10" 
          [pageSizeOptions]="[5, 10, 20]" 
          (page)="handlePageChange($event)">
        </mat-paginator>
      </mat-card>

      @if (filteredUsers().length === 0) {
        <div class="text-center py-12 bg-surface dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <mat-icon class="text-gray-400 text-6xl">search_off</mat-icon>
          <h3 class="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">No users found</h3>
        </div>
      }
    </div>
  `
})
export class UsersComponent implements OnInit {
  searchTerm = signal<string>('');
  filterRole = signal<string>('');
  filterStatus = signal<string>('');
  sortDataSignal = signal<Sort>({ active: 'id', direction: 'asc' });
  
  page = signal<number>(0);
  pageSize = signal<number>(10);
  
  users = signal<User[]>(MOCK_USERS);
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'status', 'actions'];
  private dialog: MatDialog; // Injected in constructor

  constructor(dialog: MatDialog) {
    this.dialog = dialog;
  }

  ngOnInit() {}

  // Computed: Filtered Data
  filteredUsers = computed(() => {
    let result = this.users();
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
    }
    if (this.filterRole()) result = result.filter(u => u.role === this.filterRole());
    if (this.filterStatus()) result = result.filter(u => u.status === this.filterStatus());
    
    // Sort
    const sort = this.sortDataSignal();
    if (sort.active) {
      result = [...result].sort((a, b) => {
        const aVal = a[sort.active as keyof User];
        const bVal = b[sort.active as keyof User];
        if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  });

  // Computed: Paginated Data
  paginatedUsers = computed(() => {
    const all = this.filteredUsers();
    const start = this.page() * this.pageSize();
    return all.slice(start, start + this.pageSize());
  });

  // Methods
  openCreateDialog() {
    const dialogRef = this.dialog.open(EditUserDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newUser = { ...result, id: this.users().length + 1, lastLogin: 'Never' };
        this.users.update(users => [newUser, ...users]);
      }
    });
  }

  openEditDialog(user: User) {
    const dialogRef = this.dialog.open(EditUserDialogComponent, { width: '400px', data: user });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.users.update(users => users.map(u => u.id === user.id ? { ...u, ...result } : u));
      }
    });
  }

  deleteUser(id: number) {
    if (confirm('Are you sure?')) {
      this.users.update(users => users.filter(u => u.id !== id));
    }
  }

  handlePageChange(event: PageEvent) {
    this.page.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  sortData(sort: Sort) {
    this.sortDataSignal.set(sort);
  }
}