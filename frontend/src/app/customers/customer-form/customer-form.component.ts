import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Customer } from '../../services/customer.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {
  @Input() customer: Customer = {
    first_name: '',
    last_name: '',
    email: '',
    contact_number: ''
  };
  @Input() isEdit = false;
  @Output() submitForm = new EventEmitter<Customer>();
  @Output() cancelForm = new EventEmitter<void>();

  ngOnInit() {
    if (this.isEdit && this.customer) {
      this.customer = { ...this.customer };
    }
  }

  onSubmit() {
    this.submitForm.emit(this.customer);
  }

  onCancel() {
    this.cancelForm.emit();
  }
}
