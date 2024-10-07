import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from './delete-confirmation-modal.component';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';

describe('DeleteConfirmationModalComponent', () => {
  let component: DeleteConfirmationModalComponent;
  let fixture: ComponentFixture<DeleteConfirmationModalComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DeleteConfirmationModalComponent>>;

  const dialogData = {
    item: { id: 1, description: 'Produto Teste' },
    message: 'Tem certeza que deseja excluir este produto?'
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [DeleteConfirmationModalComponent],
      imports: [CommonModule, MatDialogModule, MatButtonModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the message passed through MAT_DIALOG_DATA', () => {
    const messageElement = fixture.debugElement.query(By.css('.dialog-message')).nativeElement;
    expect(messageElement.textContent).toContain('Tem certeza que deseja excluir este produto?');
  });

  it('should call dialogRef.close(false) when onCancel is called', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should call dialogRef.close(true) when onConfirm is called', () => {
    component.onConfirm();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should display the correct item description in the dialog', () => {
    const itemDescriptionElement = fixture.debugElement.query(By.css('.item-description')).nativeElement;
    expect(itemDescriptionElement.textContent).toContain('Produto Teste');
  });

  it('should close the dialog with false when Cancel button is clicked', () => {
    const cancelButton = fixture.debugElement.query(By.css('.cancel-button')).nativeElement;
    cancelButton.click();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should close the dialog with true when Confirm button is clicked', () => {
    const confirmButton = fixture.debugElement.query(By.css('.confirm-button')).nativeElement;
    confirmButton.click();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });
});
