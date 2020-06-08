import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatInputModule,
  MatCardModule,
  MatIconModule,
  MatSnackBarModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopNavigationComponent } from './top-navigation/top-navigation.component';
import { CarouselComponent } from './carousel/carousel.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { RouterModule} from '@angular/router';
import { HttpClientModule} from '@angular/common/http';
import { PetinformationComponent } from './petinformation/petinformation.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NotificationbComponent } from './notificationb/notificationb.component';


import {DragDropModule} from '@angular/cdk/drag-drop';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TopNavigationComponent,
    CarouselComponent,
    PetinformationComponent,
    LoginComponent,
    SignupComponent,   
    NotificationbComponent,
    
    
  ],
  imports: [
    BrowserModule,NgxPaginationModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    DragDropModule,
    FormsModule,

    RouterModule.forRoot([])
  ],
  providers: [ 
    {provide: 'apiUrl', useValue: 'https://api.limantech.com/todo'}
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
