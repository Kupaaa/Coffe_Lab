import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { RouteGuardService } from '../Services/route-guard.service';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

// Define an array of routes for your Angular application
export const MaterialRoutes: Routes = [
  {
    // Route path for the 'category' component
    path: 'category',
    component: ManageCategoryComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin'], // Corrected from "expectRole" to "expectedRole"
    },
  },
  {
    // Route path for the 'product' component
    path: 'product',
    component: ManageProductComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin'], // Corrected from "expectRole" to "expectedRole"
    },
  },
  {
    // Route path for the 'order' component
    path: 'order',
    component: ManageOrderComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin', 'user'], // Corrected from "expectRole" to "expectedRole"
    },
  },
  {
    // Route path for the 'bill' component
    path: 'bill',
    component: ViewBillComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin', 'user'], // Corrected from "expectRole" to "expectedRole"
    },
  },
  {
    // Route path for the 'user' component
    path: 'user',
    component: ManageUserComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin', 'user'], // Corrected from "expectRole" to "expectedRole"
    },
  },
  
];