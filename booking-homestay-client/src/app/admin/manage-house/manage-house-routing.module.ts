import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../../shared/component/not-found/not-found.component';
import { HouseComponent } from './house/house.component';
import { ManageHouseComponent } from './manage-house.component';
import {ViewComponent} from './view/view.component';
import {BookingComponent} from './booking/booking.component';
import {OrderComponent} from './order/order.component';
import {CheckInComponent} from "./check-in/check-in.component";
import {TransactionComponent} from "./transaction/transaction.component";
import {EmployeeGuard} from "../../shared/guard/employee.guard";
import {RefundComponent} from "./refund/refund.component";

const routes: Routes = [
  {
    path: '',
    component: ManageHouseComponent,
    children: [
      {
        path: 'house',
        component: HouseComponent,
        canActivate: [EmployeeGuard],
      },
      {
        path: 'view',
        component: ViewComponent,
        canActivate: [EmployeeGuard],
      },
      {
        path: 'booking',
        component: BookingComponent,
        canActivate: [EmployeeGuard],
      },
      {
        path: 'order',
        component: OrderComponent,
        canActivate: [EmployeeGuard],
      },
      {
        path: 'check-in',
        component: CheckInComponent,
        canActivate: [EmployeeGuard],
      },
      {
        path: 'transaction',
        component: TransactionComponent,
      },
      {
        path: 'refund',
        component: RefundComponent,
      },
      {
        path: '',
        redirectTo: 'house',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageHouseRoutingModule {}
