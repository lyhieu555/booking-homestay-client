import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ManageStatisticsRoutingModule} from './manage-statistics-routing.module';
import {ManageStatisticsComponent} from './manage-statistics.component';
import { StatisticsSharedComponent } from './statistics-shared/statistics-shared.component';
import {NbCardModule, NbInputModule, NbSelectModule, NbTooltipModule} from "@nebular/theme";
import {MatIconModule} from "@angular/material/icon";
import {PieChartModule} from "@swimlane/ngx-charts";
import {StatisticAccountComponent} from "./statistic-account/statistic-account.component";
import { StatisticsHomestayComponent } from './statistics-homestay/statistics-homestay.component';
import {NgxEchartsModule} from "ngx-echarts";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatNativeDateModule} from "@angular/material/core";



@NgModule({
  declarations: [ManageStatisticsComponent, StatisticsSharedComponent, StatisticAccountComponent, StatisticsHomestayComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManageStatisticsRoutingModule,
    NbCardModule,
    MatIconModule,
    PieChartModule,
    NgxEchartsModule,
    MatDatepickerModule,
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
  ],
})
export class ManageStatisticsModule { }
