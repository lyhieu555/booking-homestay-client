import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {BookingHistoryResponse} from '../../../../shared/model/booking-history/booking-history-response';

@Component({
  selector: 'ngx-history-order',
  templateUrl: './history-order.component.html',
  styleUrls: ['./history-order.component.scss'],
})
export class HistoryOrderComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['houseName', 'dateIn', 'dateOut', 'price'
    , 'createDate', 'creatorName'];
  dataSource = new MatTableDataSource();
  idBooking: number = this.data.bookingHistory.id;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  history: BookingHistoryResponse;

  constructor(@Inject(MAT_DIALOG_DATA) private data) {
    this.dataSource.data = this.data.bookingHistory.bookingHistoryResponses;
  }

  ngOnInit(): void {
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

  loadHistory(id: number) {
    if (id) {
      this.history = this.data.bookingHistory.bookingHistoryResponses.find((options) => options.id === id);
    }
  }

}
