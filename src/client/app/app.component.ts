import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isLoggedIn: boolean = false

  constructor(
    private authService_: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService_.isLoggedIn;
    this.authService_.loggedInObservable.subscribe(value => {this.isLoggedIn = value});
  }

  onLogout() {
    this.authService_.logout();
    this.router.navigate(['/login']);
  }
}
