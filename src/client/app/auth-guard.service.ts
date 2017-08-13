import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.checkLogin(state.url);
    }

    checkLogin(requestUrl) {
        if (this.authService.isLoggedIn) { return true; }

        this.authService.redirectUrl = requestUrl;

        this.router.navigate(['/login']);
        return false;
    }
}