import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs, Response } from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';

import { AuthService } from './auth.service';

@Injectable()
export class RequestService {

    constructor(
        private http: Http,
        private router: Router
    ) {}

    public get(url: string, options?: RequestOptionsArgs) {
        options = options || {};
        this.appendHeaders_(options);

        return this.http
            .get(url, options)
            .let((observable) => this.intercept_(observable));
    }

    public post(url: string, body: any, options?: RequestOptionsArgs) {
        options = options || {};
        this.appendHeaders_(options);

        return this.http
            .post(url, body, options)
            .let((observable) => this.intercept_(observable));
    }

    private appendHeaders_(options: RequestOptionsArgs) {
        if (!options.headers) {
            options.headers = new Headers();
        }
        options.headers.append('Authorization', `Bearer ${localStorage.getItem('auth_token')}`);
        options.headers.append('Content-Type', 'application/json');
    }

    private intercept_(observable: Observable<Response>): Observable<Response> {
        
        return observable.catch((res, caught) => {
            if (res.status == 401) {
                return this.notAuthorized_();
            }

            return Observable.throw(res);
        });
    }

    private notAuthorized_(): Observable<Response> {
        this.router.navigate(['/login']);
        return Observable.empty();
    }
}