import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../service/authService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: '../template/header.html',
  styleUrls: ['../design/header/header.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
    .getAuthStatusListener().subscribe(isAuthnticated => {
      this.userIsAuthenticated = isAuthnticated;
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
