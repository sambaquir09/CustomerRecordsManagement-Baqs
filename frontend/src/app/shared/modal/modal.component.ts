import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onBackdropClick($event)">
      <div class="modal-dialog">
        <div class="modal-content">
          @if (showHeader) {
            <div class="modal-header">
              <h5 class="modal-title">{{title}}</h5>
              <button type="button" class="btn-close" (click)="close.emit()"></button>
            </div>
          }
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
    }

    .modal-dialog {
      margin: 1.75rem;
      max-width: 500px;
      width: 100%;
    }

    .modal-content {
      background-color: #fff;
      border-radius: 0.3rem;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
  `]
})
export class ModalComponent {
  @Input() title = '';
  @Input() showHeader = true;
  @Output() close = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
