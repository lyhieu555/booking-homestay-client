import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {ToastService} from '../../../shared/service/toast.service';
import {BookingService} from '../../../shared/service/booking.service';
import {throwError} from 'rxjs';
import {AddIdentityCardComponent} from './add-identity-card/add-identity-card.component';
import {HistoryOrderComponent} from "../edit-and-history/history-order/history-order.component";
import {BookingResponse} from "../../../shared/model/booking/booking-response";
import {EditCheckInComponent} from "../edit-and-history/edit-check-in/edit-check-in.component";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {DialogQuestionCanceledComponent} from "../../../shared/component/dialog-question-canceled/dialog-question-canceled.component";
import {DialogSubmitRefundComponent} from "../../../shared/component/dialog-submit-refund/dialog-submit-refund.component";

@Component({
  selector: 'ngx-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'fullname', 'dateIn', 'dateOut', 'price', 'creatorName', 'houseName', 'action'];
  dataSource = new MatTableDataSource();
  bookingResponses: BookingResponse[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isCheck: boolean = true;
  order: BookingResponse;

  constructor(private bookingService: BookingService,
              private dialog: MatDialog,
              private toastrService: ToastService) {
  }

  ngOnInit(): void {
    this.getAllBooking();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllBooking() {
    this.bookingService
      .getAllBookingNotCheckIn()
      .subscribe(
        (data) => {
          this.dataSource.data = data.filter(value => value.deposit === this.isCheck);
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

  check() {
    this.isCheck = !this.isCheck;
    this.getAllBooking();
  }

  checkIn(id) {
    const dialogRef = this.dialog.open(AddIdentityCardComponent, {
      data: {id: id},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.bookingService.checkIn(id).subscribe(
          (data) => {
            this.toastrService.showToast('warning', 'Thông báo', 'Bạn đã nhập phòng cho mã ' + id);
            this.getAllBooking();
          },
          (error) => {
            throwError(error);
            this.toastrService.showToast('danger', 'Thất bại', 'Chưa đến thời điểm nhận phòng');
          },
        );
      }
    });
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

  edit(id) {
    const dialogRef = this.dialog.open(EditCheckInComponent, {
      data: {id: id, action: 'notCheckIn'},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getAllBooking();
      }
    });
  }

  loadOrder(id: number) {
    if (id) {
      this.order = this.bookingResponses.find((options) => options.id === id);
    }
  }

  delete(id) {

  }

  openBottomSheet(id: number): void {
    const dialogRef = this.dialog.open(DialogQuestionCanceledComponent, {
      data: {id: id},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getAllBooking();
      }
    });
  }

}
