import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { ActionBarComponent } from './components/action-bar/action-bar.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should contain RouterOutlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });

  it('should contain ActionBarComponent', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-action-bar')).not.toBeNull();
  });
});
