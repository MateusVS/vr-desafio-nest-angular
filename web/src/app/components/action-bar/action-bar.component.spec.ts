import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { ProductService } from '../../services/products.service';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActionBarComponent } from './action-bar.component';

describe('ActionBarComponent', () => {
  let component: ActionBarComponent;
  let fixture: ComponentFixture<ActionBarComponent>;
  let mockTitleService: jasmine.SpyObj<Title>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let routerEventsSubject: Subject<any>;

  beforeEach(async () => {
    mockTitleService = jasmine.createSpyObj('Title', ['getTitle']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], ['url']);
    mockProductService = jasmine.createSpyObj('ProductService', ['triggerSubmit', 'triggerDelete']);

    routerEventsSubject = new Subject<any>();
    mockRouter.events = routerEventsSubject.asObservable();

    await TestBed.configureTestingModule({
      declarations: [ActionBarComponent],
      imports: [
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule
      ],
      providers: [
        { provide: Title, useValue: mockTitleService },
        { provide: Router, useValue: mockRouter },
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the initial page title from the titleService', () => {
    mockTitleService.getTitle.and.returnValue('Página de Teste');
    component.ngOnInit();
    expect(component.pageTitle).toBe('Página de Teste');
  });

  it('should update the title and route on navigation event', () => {
    mockTitleService.getTitle.and.returnValue('Nova Página');
    mockRouter.url = '/produto/cadastro';

    routerEventsSubject.next(new NavigationEnd(1, '/produto/cadastro', '/produto/cadastro'));

    expect(component.pageTitle).toBe('Nova Página');
    expect(component.isProductRegistrationRoute).toBeTrue();
  });

  it('should unsubscribe from router events on destroy', () => {
    spyOn(component['titleSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['titleSubscription'].unsubscribe).toHaveBeenCalled();
  });

  it('should trigger submit on save', () => {
    component.save();
    expect(mockProductService.triggerSubmit).toHaveBeenCalled();
  });

  it('should trigger delete on deleteProduct', () => {
    component.deleteProduct();
    expect(mockProductService.triggerDelete).toHaveBeenCalled();
  });
});
