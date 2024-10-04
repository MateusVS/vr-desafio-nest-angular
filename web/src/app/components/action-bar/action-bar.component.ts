import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'action-bar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss'
})
export class ActionBarComponent implements OnInit, OnDestroy {
  pageTitle: string = '';
  private titleSubscription: Subscription | undefined;

  constructor(
    private titleService: Title,
    private router: Router,
  ) {}

  ngOnInit() {
    this.pageTitle = this.titleService.getTitle();
    this.titleSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.pageTitle = this.titleService.getTitle();
    });
  }

  ngOnDestroy() {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
     }
  }
}
