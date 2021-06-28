import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BookingService} from '../../../shared/service/booking.service';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {throwError} from 'rxjs';
import {ToastService} from '../../../shared/service/toast.service';
import {EditCheckInComponent} from '../edit-and-history/edit-check-in/edit-check-in.component';
import {HistoryOrderComponent} from '../edit-and-history/history-order/history-order.component';
import {BookingResponse} from '../../../shared/model/booking/booking-response';
import {DialogSubmitCheckoutComponent} from '../../../shared/component/dialog-submit-checkout/dialog-submit-checkout.component';
import {Images} from "../../manage-home-stay/home-stay/add-edit-home-stay/add-edit-home-stay.component";

@Component({
  selector: 'ngx-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss'],
})
export class CheckInComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'fullname', 'dateIn', 'dateOut', 'price', 'creatorName', 'houseName', 'action'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  bookingResponses: BookingResponse[];
  image: Images[] = [];
  checkIn: BookingResponse;

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
      .getAllBookingCheckIn()
      .subscribe(
        (data) => {
          this.dataSource.data = data;
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


  edit(id) {
    const dialogRef = this.dialog.open(EditCheckInComponent, {
      data: {id: id},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getAllBooking();
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

  checkOut(id) {
    const dialogRef = this.dialog.open(DialogSubmitCheckoutComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.bookingService.checkOut(id).subscribe(
          (data) => {
            this.toastrService.showToast('success', 'Thành công', 'Trả phòng thành công');
            this.getAllBooking();
          },
          (error) => {
            this.toastrService.showToast('danger', 'Thất bại', 'Trả phòng thất bại');
            throwError(error);
          },
        );
      }
    });
  }

  loadOrder(id: number) {
    if (id) {
      this.checkIn = this.bookingResponses.find((options) => options.id === id);
      this.image = JSON.parse(this.bookingResponses.find((options) => options.id === id).identityCard);
    }
  }
}
