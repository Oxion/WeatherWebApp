import { Component, Input } from '@angular/core';

@Component({
    selector: 'weather-renderer',
    templateUrl: './weather-renderer.component.html',
    styleUrls: ['./weather-renderer.component.css']
})
export class WeatherRendererComponent {

    displayData: any;

    @Input()
    set weatherData(data: any) {
        if (!data) {
            return ;
        }

        this.displayData = this.getDisplayData(data);
    }

    getDisplayData(data: any): any {
        return {
            location: {
                name: data.name,
                coord: data.coord
            },
            description: data.weather[0].description,
            temp: {
                value: (data.main.temp - 273.15).toFixed(1),
                unit: "°C"
            },
            pressure: {
                value: data.main.pressure,
                unit: "hpa"
            },
            humidity: {
                value: data.main.humidity,
                unit: "%"
            },
            wind: {
                speed: {
                    value: data.wind.speed,
                    unit: "m/s"
                },
                deg: {
                    value: data.wind.deg,
                    unit: "deg"
                },
                direction: this.getWindDirection(data.wind.deg)
            }
        };
    }

    getWindDirection(deg: number): string {
        if (deg == 0) {
            return "North";
        } else if (deg > 0 && deg < 90) {
            return "Northeast";
        } else if (deg == 90) {
            return "East";
        } else if (deg > 90 && deg < 180) {
            return "Southeast";
        } else if (deg == 180) {
            return "South";
        } else if (deg > 180 && deg < 270) {
            return "Southwest";
        } else if (deg == 270) {
            return "West";
        } else if (deg > 270 && deg < 360) {
            return "Southwest";
        } 
    }
}