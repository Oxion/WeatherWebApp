import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/switchMap';

import { RequestService } from './request.service';

@Injectable()
export class WeatherService {

    constructor(private requestService: RequestService) { }

    public queryWeather(q: string) {

        return this
            .requestWeather_(q.trim())
            .flatMap((res) => {
                if (!res.reqId) {
                    return Observable.throw({ message: "request id is undefined" })
                }

                return this.pullWeather_(res.reqId);
            });
    }

    private requestWeather_(q: string) {
        
        return this.requestService
            .post('/api/weather', { q })
            .catch((res, caught) => {
                return Observable.throw(res);
            })
            .map((res) => res.json())
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    private getWeather_(id: string) {

        return this.requestService
            .get(`/api/weather?id=${id}`)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
            .map((res) => res.json())
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    private pullWeather_(id: string) {
        
        return this
            .getWeather_(id)
            .flatMap((res) => {
                if (res.status == "wait") {
                    return Observable
                        .timer(res.pullTimeout)
                        .flatMap((res) => this.pullWeather_(id));
                }

                return Observable.of(res);
            });
    }
}