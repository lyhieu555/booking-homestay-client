import { Component, OnInit } from '@angular/core';
import {NbThemeService} from "@nebular/theme";
import {StatisticService} from "../../../shared/service/statistic.service";

@Component({
  selector: 'ngx-statistics-shared',
  templateUrl: './statistics-shared.component.html',
  styleUrls: ['./statistics-shared.component.scss']
})
export class StatisticsSharedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
