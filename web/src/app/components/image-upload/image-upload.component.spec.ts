import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageUploadComponent } from './image-upload.component';
import { By } from '@angular/platform-browser';

describe('ImageUploadComponent', () => {
  let component: ImageUploadComponent;
  let fixture: ComponentFixture<ImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageUploadComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the input initialImage', () => {
    component.initialImage = 'data:image/png;base64,sampleBase64Data';
    component.ngOnChanges();
    expect(component.imageUrl).toBe('data:image/png;base64,sampleBase64Data');
  });

  it('should emit imageChange event when a file is uploaded', (done) => {
    spyOn(component.imageChange, 'emit');

    const file = new Blob(['sample-image'], { type: 'image/png' });
    const event = {
      target: {
        files: [file]
      }
    } as unknown as Event;

    const readerSpy = spyOn(window, 'FileReader').and.callFake(() => {
      return {
        readAsDataURL: () => {
          (readerSpy as any).onload();
        },
        result: 'data:image/png;base64,sampleBase64Data',
        onload: null
      } as unknown as FileReader;
    });

    component.onFileChange(event);

    setTimeout(() => {
      expect(component.imageUrl).toBe('data:image/png;base64,sampleBase64Data');
      expect(component.imageChange.emit).toHaveBeenCalledWith('data:image/png;base64,sampleBase64Data');
      done();
    }, 0);
  });

  it('should not emit imageChange event if no file is uploaded', () => {
    spyOn(component.imageChange, 'emit');

    const event = {
      target: {
        files: []
      }
    } as unknown as Event;

    component.onFileChange(event);
    expect(component.imageChange.emit).not.toHaveBeenCalled();
  });
});
