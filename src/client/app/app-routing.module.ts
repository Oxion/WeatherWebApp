import { NgModule } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { AuthGuard } from './auth-guard.service';

import { LoginComponent } from './login.component';
import { WeatherComponent } from './weather.component';
import { WeatherSearchComponent } from './weather-search.component';

const appRoutes: Routes = [{
    path: 'login', 
    component: LoginComponent
}, {
    path: '', 
    component: WeatherComponent, 
    canActivate: [AuthGuard],
    children: [{
        path: 'weather',
        component: WeatherSearchComponent
    }]
}];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}