import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Customer } from '../../services/customer.service';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent {
  @Input() customer!: Customer;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Customer>();

  onClose() {
    this.close.emit();
  }

  onEdit() {
    this.edit.emit(this.customer);
  }
}
