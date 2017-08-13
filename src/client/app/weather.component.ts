import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'weather',
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.css']
})
export class WeatherComponent {

    query: string;

    constructor(private router: Router) {}

    onKeyUp(event) {
        if (event.keyCode != 13) {
            return;
        }

        this.router.navigate(['/weather'], {queryParams: {q: this.query}})
    }

    onFind() {
        this.router.navigate(['/weather'], {queryParams: {q: this.query}})
    }
    
}
