import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material-module';
import { HomeComponent } from './home/home.component';
import { BestSellerComponent } from './best-seller/best-seller.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from './shared/shared.module';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './signup/signup.component';
import {NgxUiLoaderModule,NgxUiLoaderHttpModule,NgxUiLoaderConfig,SPINNER,PB_DIRECTION,} from "ngx-ui-loader";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { TokenInterceptor } from './Services/token.interceptor';



// Configuration for the NgxUiLoaderModule.
const ngxUiLoaderConfig: NgxUiLoaderConfig ={
  text:"Loading...",
  textColor:"#FFFFFF",
  textPosition:"center-center",
  pbColor:"#FFFF8D",
  bgsColor:"#1C1D1E",
  fgsColor:"#FFFF8D",
  fgsType: SPINNER.ballSpinFadeRotating,
  fgsSize: 100,
  pbDirection:PB_DIRECTION.leftToRight,
  pbThickness:5
}

@NgModule({
  declarations: [	
    AppComponent,
    HomeComponent,
    BestSellerComponent,
    FullComponent,
    AppHeaderComponent,
    AppSidebarComponent,
    SignupComponent,
    ForgotPasswordComponent,
    LoginComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    SharedModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig), // Add NgxUiLoaderHttpModule here
  

  ],
  providers: [HttpClientModule,{provide:HTTP_INTERCEPTORS,useClass:TokenInterceptor,multi:true}], // You can add service providers here
  bootstrap: [AppComponent], // The root component to bootstrap
})
export class AppModule { }
