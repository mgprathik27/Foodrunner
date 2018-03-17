import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import {FlashMessagesModule} from 'angular2-flash-messages'

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthGuard } from './gaurds/auth.guard';
import {AuthenticationService} from './services/authentication.service';
import { CartComponent } from './components/cart/cart.component';
import { MenuComponent } from './components/menu/menu.component';
import {FoodService} from './services/food.service';
import { FoodComponent } from './components/food/food.component';


const appRoutes : Routes = [
  {path: '', component : HomeComponent},
  {path: 'register', component : RegisterComponent},
  {path: 'login', component : LoginComponent},
  {path: 'profile', component : ProfileComponent, canActivate : [AuthGuard]},
  {path: 'menu', component : MenuComponent,  canActivate : [AuthGuard]},
  {path: 'cart', component : CartComponent,  canActivate : [AuthGuard]},
  {path: 'food', component : FoodComponent,  canActivate : [AuthGuard]}
]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    NavbarComponent,
    CartComponent,
    MenuComponent,
    FoodComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule.forRoot() 
  ],
  providers: [AuthGuard, AuthenticationService,FoodService],
  bootstrap: [AppComponent]
})
export class AppModule { }
