import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManageHouseComponent} from './manage-house.component';
import {HouseComponent} from './house/house.component';
import {ManageHouseRoutingModule} from './manage-house-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbPopoverModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbTooltipModule,
  NbTreeGridModule,
} from '@nebular/theme';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EditHouseComponent} from './house/edit-house/edit-house.component';
import {AddHouseComponent} from './house/add-house/add-house.component';
import {DetailHouseComponent} from './house/detail-house/detail-house.component';
import {CKEditorModule} from 'ng2-ckeditor';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatStepperModule} from '@angular/material/stepper';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {ViewComponent} from './view/view.component';
import {AddEditViewComponent} from './view/add-edit-view/add-edit-view.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {BookingComponent} from './booking/booking.component';
import {OrderComponent} from './order/order.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatNativeDateModule} from '@angular/material/core';
import {EditDetailUtilityComponent} from './house/edit-detail-utility/edit-detail-utility.component';
import {HistoryOrderComponent} from './edit-and-history/history-order/history-order.component';
import {EditCheckInComponent} from './edit-and-history/edit-check-in/edit-check-in.component';
import {CheckInComponent} from './check-in/check-in.component';
import {AddIdentityCardComponent} from './order/add-identity-card/add-identity-card.component';
import {ComponentModule} from "../../shared/component/component.module";
import {MatExpansionModule} from "@angular/material/expansion";
import {NgImageSliderModule} from "ng-image-slider";
import {WebcamModule} from "ngx-webcam";
import {TransactionComponent} from './transaction/transaction.component';
import {RefundComponent} from './refund/refund.component';

@NgModule({
  declarations: [
    ManageHouseComponent,
    HouseComponent,
    EditHouseComponent,
    AddHouseComponent,
    DetailHouseComponent,
    ViewComponent,
    AddEditViewComponent,
    BookingComponent,
    OrderComponent,
    EditDetailUtilityComponent,
    HistoryOrderComponent,
    EditCheckInComponent,
    CheckInComponent,
    AddIdentityCardComponent,
    TransactionComponent,
    RefundComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ManageHouseRoutingModule,
    MatCardModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    Ng2SmartTableModule,
    NbSpinnerModule,
    NbCheckboxModule,
    NbTabsetModule,
    NbPopoverModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbTooltipModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatDialogModule,
    CKEditorModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    ComponentModule,
    MatExpansionModule,
    NgImageSliderModule,
    WebcamModule,
    NbActionsModule,
  ],
})
export class ManageHouseModule {
}
