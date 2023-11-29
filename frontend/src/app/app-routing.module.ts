import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FullComponent } from './layouts/full/full.component';
import { RouteGuardService } from './Services/route-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'cafe',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/cafe/dashboard',
        pathMatch: 'full',
      },
      {
        path: '', // The route path, which is the default or home page.
        loadChildren: () => import('./material-component/material.module').then(m => m.MaterialComponentsModule), 
        canActivate: [RouteGuardService], // Specifies the route guard to determine access to this route.
        data: {
          expectedRole: ['admin', 'user'] // Expected user roles allowed to access this route.
        }
      },
      {
        path: 'dashboard', // The route path for the dashboard.
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), 
        canActivate: [RouteGuardService], // Specifies the route guard to determine access to this route.
        data: {
          expectedRole: ['admin', 'user'] // Expected user roles allowed to access this route.
        }
      }
      
    ]
  },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


