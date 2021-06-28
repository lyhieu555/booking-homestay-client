import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbThemeService} from "@nebular/theme";
import {StatisticService} from "../../../shared/service/statistic.service";
import {throwError} from "rxjs";
import {AccountResponse} from "../../../shared/model/statistics/account.response";

@Component({
  selector: 'ngx-statistic-account',
  templateUrl: './statistic-account.component.html',
  styleUrls: ['./statistic-account.component.scss']
})
export class StatisticAccountComponent implements OnDestroy {

  accountResponse: AccountResponse[] = [];

  colorScheme: any;
  themeSubscription: any;

  constructor(private theme: NbThemeService, private statisticService: StatisticService) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: [colors.primaryLight, colors.infoLight, colors.successLight, colors.warningLight, colors.dangerLight],
      };
    });
    this.statisticService.getAccount().subscribe(
      (data) => {
        this.accountResponse = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

}
