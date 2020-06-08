import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarouselComponent } from './carousel/carousel.component';
import { PetinformationComponent } from './petinformation/petinformation.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NotificationbComponent } from './notificationb/notificationb.component';

const routes: Routes = [
  {path:"",redirectTo:'/login',pathMatch:'full'},
 {path:'carousel',component: CarouselComponent},
 {path:'petinformation',component: PetinformationComponent},
 {path:'login',component: LoginComponent},
 {path:'signup',component: SignupComponent},
 {path:'notificationb',component:NotificationbComponent}

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
