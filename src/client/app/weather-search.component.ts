import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { WeatherService } from './weather.service';

const DISPLAY_MESSAGES = {
    LOADING: "Now find out. Please wait.",
    EMPTY_QUERY: "Your query is empty. Please enter city name",
    ERROR: "Sorry something going wrong... Try again"
}

@Component({
    selector: 'weather-search',
    templateUrl: './weather-search.component.html',
    styleUrls: ['./weather-search.component.css']
})
export class WeatherSearchComponent implements OnInit {

    message: string = "";

    weatherData: any;

    isQuering: boolean = true;

    private querySubscription_: Subscription;

    constructor(
        private route_: ActivatedRoute, 
        private router_: Router, 
        private weatherService_: WeatherService
    ) {}

    ngOnInit() {
        this.route_.queryParams.subscribe((params) => {
            this.query = params.q;
        });
    }

    set query(query: string) {
       this.requestWeather(query);
    }

    private requestWeather(query: string) {
        if (!query || !query.trim()) { 
            this.isQuering = true;
            this.message = DISPLAY_MESSAGES.EMPTY_QUERY;
            return 
        }

        if (this.querySubscription_) {
            this.querySubscription_.unsubscribe();
        }

        this.isQuering = true;
        this.message = DISPLAY_MESSAGES.LOADING;

        this.querySubscription_ = this.weatherService_
            .queryWeather(query)
            .subscribe(
                (res) => this.onRequestWeatherSuccess(res), 
                (err) => this.onRequestWeatherFailure(err)
            );
    }

    private onRequestWeatherSuccess(res) {

        this.weatherData = res.response;

        this.isQuering = false;
        this.message = "";
    }

    private onRequestWeatherFailure(err) {
        this.isQuering = false;
        this.message = DISPLAY_MESSAGES.ERROR;
    }
}