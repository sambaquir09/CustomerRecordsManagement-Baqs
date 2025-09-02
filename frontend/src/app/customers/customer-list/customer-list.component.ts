import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';
import { CustomerService, Customer, PaginatedResponse } from '../../services/customer.service';
import { HttpClientModule } from '@angular/common/http';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, CustomerFormComponent, CustomerDetailComponent, HttpClientModule, ModalComponent],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  showForm = false;
  showDetail = false;
  showDeleteConfirm = false;
  selectedCustomer: Customer | null = null;
  isEditMode = false;
  isLoading = false;
  error: string | null = null;
  
  // Pagination
  currentPage = 1;
  lastPage = 1;
  totalItems = 0;
  itemsPerPage = 10;
  pageNumbers: number[] = [];

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers(page: number = 1) {
    this.isLoading = true;
    this.error = null;
    this.customerService.getCustomers(page)
      .subscribe({
        next: (response) => {
          this.customers = response.data;
          this.currentPage = response.current_page;
          this.lastPage = response.last_page;
          this.totalItems = response.total;
          this.itemsPerPage = response.per_page;
          this.generatePageNumbers();
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Error loading customers. Please try again later.';
          this.isLoading = false;
          console.error('Error:', error);
        }
      });
  }

  generatePageNumbers() {
    this.pageNumbers = [];
    const totalPages = this.lastPage;
    const currentPage = this.currentPage;
    
    // Always show first page
    this.pageNumbers.push(1);
    
    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
      this.pageNumbers.push(i);
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1 && !this.pageNumbers.includes(totalPages)) {
      this.pageNumbers.push(totalPages);
    }
  }

  onPageChange(page: number) {
    if (page !== this.currentPage && page >= 1 && page <= this.lastPage) {
      this.loadCustomers(page);
    }
  }

  onAddCustomer() {
    this.showForm = true;
    this.isEditMode = false;
    this.selectedCustomer = null;
  }

  onEditCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    this.showForm = true;
    this.isEditMode = true;
    this.showDetail = false;
  }

  onViewCustomer(customer: Customer) {
    this.customerService.getCustomer(customer.id!)
      .subscribe({
        next: (data) => {
          this.selectedCustomer = data;
          this.showDetail = true;
          this.showForm = false;
        },
        error: (error) => {
          console.error('Error fetching customer details:', error);
          // Show error message to user
        }
      });
  }

  onDeleteCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (this.selectedCustomer?.id) {
      this.customerService.deleteCustomer(this.selectedCustomer.id)
        .subscribe({
          next: () => {
            this.customers = this.customers.filter(c => c.id !== this.selectedCustomer?.id);
            this.showDeleteConfirm = false;
            this.selectedCustomer = null;
          },
          error: (error) => {
            console.error('Error deleting customer:', error);
            // Show error message to user
          }
        });
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.selectedCustomer = null;
  }

  onFormSubmit(customer: Customer) {
    if (this.isEditMode && this.selectedCustomer?.id) {
      // Update existing customer
      this.customerService.updateCustomer(this.selectedCustomer.id, customer)
        .subscribe({
          next: (updatedCustomer) => {
            this.customers = this.customers.map(c => 
              c.id === this.selectedCustomer?.id ? updatedCustomer : c
            );
            this.closeForm();
          },
          error: (error) => {
            console.error('Error updating customer:', error);
            // Show error message to user
          }
        });
    } else {
      // Create new customer
      this.customerService.createCustomer(customer)
        .subscribe({
          next: (newCustomer) => {
            this.customers = [...this.customers, newCustomer];
            this.closeForm();
          },
          error: (error) => {
            console.error('Error creating customer:', error);
            // Show error message to user
          }
        });
    }
  }

  closeForm() {
    this.showForm = false;
    this.isEditMode = false;
    this.selectedCustomer = null;
  }

  closeDetail() {
    this.showDetail = false;
    this.selectedCustomer = null;
  }
}

