import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ProductService } from '../../services/products.service';

@Component({
  selector: 'action-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss'
})
export class ActionBarComponent implements OnInit, OnDestroy {
  @Output() saveProduct = new EventEmitter<void>();

  pageTitle: string = '';
  isProductRegistrationRoute: boolean = false;
  private titleSubscription: Subscription | undefined;

  constructor(
    private titleService: Title,
    private router: Router,
    private productService: ProductService,
  ) {}

  ngOnInit() {
    this.pageTitle = this.titleService.getTitle();
    this.titleSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTitleAndRoute();
    });
  }

  ngOnDestroy() {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
     }
  }

  private updateTitleAndRoute() {
    this.pageTitle = this.titleService.getTitle();
    this.isProductRegistrationRoute = this.router.url.includes('/produto/cadastro');
  }

  save() {
    this.productService.triggerSubmit();
  }

  deleteProduct() {
    this.productService.triggerDelete();

  }
}
