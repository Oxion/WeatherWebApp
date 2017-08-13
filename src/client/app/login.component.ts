import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    username: string;

    password: string;

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }

        let observable = this.authService.login(form.value.username, form.value.password);
        observable.subscribe((isLoggedIn) => {
            if (!isLoggedIn) {
                //TODO message
                return;
            }
            
            let redirectUrl = this.authService.redirectUrl || '/';
            this.router.navigateByUrl(redirectUrl);
        });
    }
}