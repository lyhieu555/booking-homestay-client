import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {throwError} from 'rxjs';
import {DetailViewService} from '../../../../shared/service/detail-view.service';
import {DetailUtilityService} from '../../../../shared/service/detail-utility.service';
import {DetailViewResponse} from '../../../../shared/model/detail-view/detail-view-response';
import {DetailUtilityResponse} from '../../../../shared/model/detail-utility/detail-utility-response';
import {HouseResponse} from "../../../../shared/model/house/house-response";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

export interface Image {
  image: string;
  thumbImage: string;
}

@Component({
  selector: 'ngx-detail-house',
  templateUrl: './detail-house.component.html',
  styleUrls: ['./detail-house.component.scss'],
})
export class DetailHouseComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['userName', 'createDate', 'content', 'rate'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  image: Image[] = [];
  detailViews: DetailViewResponse[];
  detailUtilitys: DetailUtilityResponse[];
  houses: HouseResponse;
  constructor(@Inject(MAT_DIALOG_DATA) private data,
              private detailViewService: DetailViewService,
              private detailUtilityService: DetailUtilityService) {
    this.image = JSON.parse(data.house.image);
    this.houses =  this.data.house;
    this.dataSource.data = this.data.house.feedbackResponses;
  }

  ngOnInit(): void {
    this.getAllDetailUtility();
    this.getAllDetailView();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllDetailView() {
    this.detailViewService.getAllDetailView(this.data.house.id).subscribe(
      (data) => {
        this.detailViews = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  getAllDetailUtility() {
    this.detailUtilityService.getAllDetailUtility(this.data.house.id).subscribe(
      (data) => {
        this.detailUtilitys = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

}
