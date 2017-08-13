import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { LoginComponent } from './login.component';
import { WeatherComponent } from './weather.component';
import { WeatherSearchComponent } from './weather-search.component';
import { WeatherRendererComponent } from './weather-renderer.component';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AuthGuard } from './auth-guard.service';

import { AuthService } from './auth.service';
import { WeatherService } from './weather.service';
import { RequestService } from './request.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WeatherComponent,
    WeatherSearchComponent,
    WeatherRendererComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    RequestService,
    AuthGuard,
    AuthService,
    WeatherService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
