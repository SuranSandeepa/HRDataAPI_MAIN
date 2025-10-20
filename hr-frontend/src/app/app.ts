import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

// --- Interface for Employee Data ---
interface Employee {
  id: number;
  fullName: string;
  department: string;
  hireDate: string;
  salary: number;
}

// --- API Service (Singleton) ---
@Component({
  standalone: true,
  selector: 'employee-api-service',
  template: '',
})
export class EmployeeApiService {
  private apiUrl = 'http://localhost:5120/api/employees';

  private http = inject(HttpClient);

  getEmployees(searchTerm: string = ''): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}?searchTerm=${searchTerm}`);
  }

  uploadFile(file: File): Observable<{ count: number; message: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<{ count: number; message: string }>(`${this.apiUrl}/upload`, formData);
  }
}

// --- Main Application Component ---
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [EmployeeApiService, DatePipe, CurrencyPipe],
  template: `
    <!-- Main container with aesthetic background -->
    <div class="bg-light min-vh-100 py-5">
      <div class="container">
        <!-- Main Card with Strong Shadow -->
        <div class="card shadow-lg border-0 rounded-3">
          <div class="card-header bg-primary text-white py-4 rounded-top-3">
            <h1 class="h3 mb-0 fw-bold">HR Employee Data Management Portal</h1>
            <p class="mb-0 text-white-50">Full-stack data synchronization and management</p>
          </div>
          <div class="card-body p-4 p-md-5">
            <p class="text-muted border-bottom pb-3 mb-4">
              Securely import, search, and manage employee data from Excel sheets.
            </p>

            <!-- Upload Section (Distinct Color Background) -->
            <div
              class="p-4 bg-secondary-subtle rounded-3 shadow-sm mb-5 border-start border-5 border-secondary"
            >
              <h2 class="h5 text-secondary mb-4 fw-bold">Excel Data Import</h2>

              <div class="mb-3">
                <label class="form-label text-muted">Select Employee Data File (.xlsx)</label>
                <input
                  type="file"
                  (change)="onFileSelected($event)"
                  class="form-control form-control-sm"
                  accept=".xlsx"
                />
              </div>

              <button
                (click)="uploadFile()"
                [disabled]="!selectedFile() || loading()"
                class="btn btn-primary btn-sm px-4 shadow-sm fw-semibold"
              >
                <!-- Bootstrap Spinner -->
                <span
                  *ngIf="loading()"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                {{ loading() ? 'Importing Data...' : 'Upload & Process Records' }}
              </button>

              <!-- Status Message (Bootstrap Alerts) -->
              <div *ngIf="statusMessage()" class="mt-3">
                <div
                  class="alert alert-dismissible fade show mb-0"
                  [ngClass]="statusType() === 'success' ? 'alert-success' : 'alert-danger'"
                  role="alert"
                >
                  {{ statusMessage() }}
                </div>
              </div>
            </div>

            <!-- Data Display and Search Section -->
            <div>
              <h2 class="h5 mb-4 border-bottom pb-2 fw-bold text-dark">
                Searchable Records ({{ employees()?.length || 0 }})
              </h2>

              <!-- Search Input (Bootstrap Form Control) -->
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (ngModelChange)="searchEmployees()"
                placeholder="Search by Name or Department..."
                class="form-control mb-4 shadow-sm"
              />

              <!-- Employee Table (Enhanced Bootstrap Striped Table) -->
              <div *ngIf="employees() && employees()!.length > 0; else noData">
                <div class="table-responsive">
                  <table class="table table-striped table-hover table-bordered shadow-sm">
                    <thead class="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Department</th>
                        <th>Hire Date</th>
                        <th>Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let employee of employees()">
                        <!-- FIX: Appending 'EMP' suffix to the ID -->
                        <th scope="row">EMP{{ employee.id }}</th>
                        <td>{{ employee.fullName }}</td>
                        <td>{{ employee.department }}</td>
                        <td>{{ employee.hireDate | date : 'mediumDate' }}</td>
                        <td class="font-monospace">
                          {{ employee.salary | currency : 'LKR' : 'symbol' : '1.2-2' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <ng-template #noData>
                <div class="alert alert-info text-center border-info">
                  No employee data found. Start by uploading an Excel sheet.
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Custom styling for a slightly modern Bootstrap feel */
      .card-header {
        background-color: #0d6efd; /* Official Bootstrap Primary Blue */
        border-color: #0d6efd;
      }
      .bg-secondary-subtle {
        background-color: #e9ecef; /* Lighter background for the form section */
      }
      .table-dark {
        --bs-table-bg: #343a40; /* Darker header for better contrast */
        --bs-table-color: #ffffff;
      }
      .btn-primary {
        background-color: #0d6efd;
        border-color: #0d6efd;
      }
      .btn-primary:hover {
        background-color: #0b5ed7;
        border-color: #0a58ca;
      }
    `,
  ],
})
export class App implements OnInit {
  private apiService = inject(EmployeeApiService);

  employees = signal<Employee[] | undefined>([]);
  selectedFile = signal<File | null>(null);
  loading = signal(false);
  statusMessage = signal<string | null>(null);
  statusType = signal<'success' | 'error' | null>(null);

  searchTerm: string = '';

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.apiService.getEmployees(this.searchTerm).subscribe({
      next: (data: Employee[]) => {
        this.employees.set(data || []);
      },
      error: (err: any) => {
        console.error('Error fetching data:', err);
        this.setStatus('error', 'Failed to fetch employee data from API. Check browser console.');
      },
    });
  }

  searchEmployees() {
    this.fetchEmployees();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    } else {
      this.selectedFile.set(null);
    }
    this.statusMessage.set(null);
  }

  uploadFile() {
    const file = this.selectedFile();
    if (!file) return;

    this.loading.set(true);
    this.statusMessage.set(null);

    this.apiService.uploadFile(file).subscribe({
      next: (response: { count: number; message: string }) => {
        this.setStatus('success', response.message || 'Upload successful!');
        this.selectedFile.set(null);
        this.fetchEmployees();
      },
      error: (err: any) => {
        console.error('Upload Error:', err);
        const errorMsg = err.error?.message || 'Upload failed. Check API status.';
        this.setStatus('error', errorMsg);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  setStatus(type: 'success' | 'error', message: string) {
    this.statusType.set(type);
    this.statusMessage.set(message);
    setTimeout(() => this.statusMessage.set(null), 5000);
  }
}
