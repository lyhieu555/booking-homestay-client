import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {NbThemeService} from "@nebular/theme";
import {throwError} from "rxjs";
import {StatisticService} from "../../../shared/service/statistic.service";
import {TimeRequest} from "../../../shared/model/statistics/time.request";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DateAdapter} from "@angular/material/core";
import {DatePipe} from "@angular/common";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";

@Component({
  selector: 'ngx-statistics-homestay',
  templateUrl: './statistics-homestay.component.html',
  styleUrls: ['./statistics-homestay.component.scss']
})
export class StatisticsHomestayComponent implements AfterViewInit, OnDestroy, OnInit {
  options: any = {};
  themeSubscription: any;
  timeRequest: TimeRequest;
  dateForm: FormGroup;

  constructor(private theme: NbThemeService, private statisticService: StatisticService, private _adapter: DateAdapter<any>,
              private datePipe: DatePipe) {
    this._adapter.setLocale('vi');
  }

  ngOnInit(): void {
    this.timeRequest = {
      firstDay: null,
      lastDay: null,
    };
    this.dateForm = new FormGroup({
      firstDay: new FormControl({value: null, disabled: true}),
      lastDay: new FormControl({value: null, disabled: true}),
    });
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.statisticService.getHomeStay(this.timeRequest).subscribe(
        (data) => {
          this.options = {
            backgroundColor: echarts.bg,
            color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)',
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: data.map(value => value.name),
              textStyle: {
                color: echarts.textColor,
              },
            },
            series: [
              {
                name: 'VNĐ',
                type: 'pie',
                radius: '80%',
                center: ['50%', '50%'],
                data: data,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: echarts.itemHoverShadowColor,
                  },
                },
                label: {
                  normal: {
                    textStyle: {
                      color: echarts.textColor,
                    },
                  },
                },
                labelLine: {
                  normal: {
                    lineStyle: {
                      color: echarts.axisLineColor,
                    },
                  },
                },
              },
            ],
          };
        },
        (error) => {
          throwError(error);
        },
      );
      const colors = config.variables;
      const echarts: any = config.variables.echarts;


    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  endChange(event: MatDatepickerInputEvent<any>) {
    if (this.dateForm.get('lastDay').value) {
      this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
        this.timeRequest.firstDay = this.datePipe.transform(this.dateForm.get('firstDay').value, 'yyyy-MM-dd');
        this.timeRequest.lastDay = this.datePipe.transform(this.dateForm.get('lastDay').value, 'yyyy-MM-dd');
        this.statisticService.getHomeStay(this.timeRequest).subscribe(
          (data) => {
            this.options = {
              backgroundColor: echarts.bg,
              color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)',
              },
              legend: {
                orient: 'vertical',
                left: 'left',
                data: data.map(value => value.name),
                textStyle: {
                  color: echarts.textColor,
                },
              },
              series: [
                {
                  name: 'VNĐ',
                  type: 'pie',
                  radius: '80%',
                  center: ['50%', '50%'],
                  data: data,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: echarts.itemHoverShadowColor,
                    },
                  },
                  label: {
                    normal: {
                      textStyle: {
                        color: echarts.textColor,
                      },
                    },
                  },
                  labelLine: {
                    normal: {
                      lineStyle: {
                        color: echarts.axisLineColor,
                      },
                    },
                  },
                },
              ],
            };
          },
          (error) => {
            throwError(error);
          },
        );
        const colors = config.variables;
        const echarts: any = config.variables.echarts;
      });
    }
  }
}
