import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {BookingResponse} from '../../../shared/model/booking/booking-response';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {BookingService} from '../../../shared/service/booking.service';
import {MatDialog} from '@angular/material/dialog';
import {ToastService} from '../../../shared/service/toast.service';
import {throwError} from 'rxjs';
import {HistoryOrderComponent} from '../edit-and-history/history-order/history-order.component';
import {DialogSubmitRefundComponent} from '../../../shared/component/dialog-submit-refund/dialog-submit-refund.component';

@Component({
  selector: 'ngx-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss'],
})
export class RefundComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'fullname', 'dateIn', 'dateOut', 'price', 'creatorName', 'houseName', 'action'];
  dataSource = new MatTableDataSource();
  bookingResponses: BookingResponse[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  order: BookingResponse;

  constructor(private bookingService: BookingService,
              private dialog: MatDialog,
              private toastrService: ToastService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllBooking($event: any) {
    this.bookingService
      .getAllBookingCancellation()
      .subscribe(
        (data) => {
          this.dataSource.data = data.filter(value => value.status === $event.tabId);
          this.bookingResponses = data;
        },
        (error) => {
          throwError(error);
        },
      );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  history(id) {
    const dialogRef = this.dialog.open(HistoryOrderComponent, {
      data: {
        bookingHistory: this.bookingResponses.find(value => {
          if (value.id === id) {
            return value.bookingHistoryResponses;
          }
        }),
      },
    });
  }

  loadOrder(id: number) {
    if (id) {
      this.order = this.bookingResponses.find((options) => options.id === id);
    }
  }

  refund(id) {
    const dialogRef = this.dialog.open(DialogSubmitRefundComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.bookingService
          .refunded(id)
          .subscribe(
            (data) => {
              this.toastrService.showToast('warning', 'Thông báo', 'Bạn đã xác nhận thanh toán cho mã ' + id);
              this.getAllBooking('Processing');
            },
            (error) => {
              throwError(error);
              this.toastrService.showToast('danger', 'Thất bại', 'Xác nhận thất bại');
            },
          );
      }
    });
  }

}
