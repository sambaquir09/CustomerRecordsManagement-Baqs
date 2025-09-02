import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Customer {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{ url: string | null; label: string; active: boolean }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) { }

  // Get all customers with pagination
  getCustomers(page: number = 1): Observable<PaginatedResponse<Customer>> {
    return this.http.get<PaginatedResponse<Customer>>(`${this.apiUrl}?page=${page}`);
  }

  // Get a single customer
  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  // Create a new customer
  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  // Update a customer
  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  // Delete a customer
  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Search customers
  searchCustomers(query: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}?search=${query}`);
  }
}
