import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { RequestService } from './request.service';

@Injectable()
export class AuthService {
    private isLoggedIn_: boolean = false;
    
    private loggedInSource = new Subject<boolean>();

    public redirectUrl: string;

    public loggedInObservable = this.loggedInSource.asObservable();

    constructor(private requestService: RequestService) {
        this.isLoggedIn = !!localStorage.getItem('auth_token');
    }

    public set isLoggedIn(loggedIn: boolean) {
        this.isLoggedIn_ = loggedIn;
        this.loggedInSource.next(loggedIn);
    }

    public get isLoggedIn() {
        return this.isLoggedIn_;
    }

    public login(username: string, password: string): Observable<boolean> {
        let observable = this.requestService.post('/login', {username, password});
        
        return observable.map((res: Response) => {
           if (res.status != 200) {
               this.dropAuthentication_();
               return false;
           }

           var data = res.json();
           if (!data || !data.auth_token) {
               this.dropAuthentication_();
               return false;
           }

           localStorage.setItem('auth_token', data.auth_token);
           this.isLoggedIn = true;

           return true;
        });
    }

    public logout(): Observable<boolean> {
        let observable = this.requestService.post('/logout', {});
        this.dropAuthentication_();

        return observable.map((res: Response) => {
            this.isLoggedIn = false;
            return true;
        });
    }

    private dropAuthentication_(): void {
        this.isLoggedIn = false;
        localStorage.removeItem('auth_token');
    }
}