import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MemberService} from '../../../shared/service/member-service.service';
import {Observable, throwError} from 'rxjs';
import {MemberResponse} from '../../../shared/model/member/member-response';
import {map, startWith} from 'rxjs/operators';
import {DateAdapter} from '@angular/material/core';
import {DatePipe} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {BookingRequest} from '../../../shared/model/booking/booking-request';
import {BookingService} from '../../../shared/service/booking.service';
import {ToastService} from '../../../shared/service/toast.service';
import {HouseService} from '../../../shared/service/house.service';
import {HouseResponse} from '../../../shared/model/house/house-response';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {AddMemberComponent} from "../../manage-user/member/add-member/add-member.component";
import {DialogSubmitBookingComponent} from "../../../shared/component/dialog-submit-booking/dialog-submit-booking.component";

@Component({
  selector: 'ngx-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  members: MemberResponse[];
  bookingRequest: BookingRequest;
  filteredOptionsEdit: Observable<MemberResponse[]>;
  user: string;
  houses: HouseResponse[];
  dateLock: string[] = [];
  today = new Date();

  constructor(private memberService: MemberService,
              private bookingService: BookingService,
              private toastService: ToastService,
              private _adapter: DateAdapter<any>,
              private datePipe: DatePipe,
              private houseService: HouseService,
              private dialog: MatDialog) {
    this._adapter.setLocale('vi');
  }

  ngOnInit(): void {
    this.bookingRequest = {
      id: undefined,
      fullName: null,
      address: null,
      email: null,
      phone: null,
      description: null,
      id_user: undefined,
      id_house: undefined,
      price: null,
      discount: undefined,
      costsIncurred: undefined,
      deposit: undefined,
      dateIn: null,
      dateOut: null,
      identityCard: null,
      id_creator: null,
    },
      this.bookingForm = new FormGroup({
        fullName: new FormControl(null, Validators.maxLength(40)),
        address: new FormControl(null, Validators.maxLength(50)),
        email: new FormControl(null, [Validators.required, Validators.email]),
        phone: new FormControl(null, [Validators.required, Validators.pattern(/((09|03|07|08|05)+([0-9]{8})\b)/), Validators.pattern(/^\S*$/),
        ]),
        description: new FormControl(null),
        id_user: new FormControl(null),
        id_house: new FormControl(null, Validators.required),
        price: new FormControl({value: null, disabled: true}, Validators.required),
        deposit: new FormControl(false),
        dateIn: new FormControl({value: null, disabled: true}, Validators.required),
        dateOut: new FormControl({value: null, disabled: true}, Validators.required),
      });
    this.getAllMember();
    this.filterUser();
    this.getAllHouse();
  }

  getAllHouse() {
    this.houseService.getAllHouseNoLock().subscribe(
      (data) => {
        this.houses = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  filterDate = (fullDate: Date): boolean => {
    const time = fullDate.getTime();
    return !this.dateLock.find(x => new Date(x).getTime() === time);
  }


  filterUser() {
    this.filteredOptionsEdit = this.bookingForm
      .get('phone')
      .valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value?.name)),
        map((phone) => (phone ? this._filter(phone) : [])),
      );
  }

  displayFn(phone: string) {
    if (phone) {
      return this.members.find((options) => options.phone === phone).phone;
    }
  }

  loadDetail() {
    const value = this.members.find((options) => options.phone === this.bookingForm.get('phone').value);
    if (this.bookingForm.get('phone').value != null) {
      this.bookingForm.get('fullName').setValue(value.lastName === null ? '' : value.lastName + ' ' + value.firstName === null ? '' : value.firstName);
      this.bookingForm.get('address').setValue(value.address);
      this.bookingForm.get('email').setValue(value.email);
      this.bookingForm.get('id_user').setValue(value.id);
      this.user = value.userName;
    }
  }

  private _filter(name: string): MemberResponse[] {
    const filterValue = name.toLowerCase();
    return this.members.filter(
      (option) => option.phone.toLowerCase() === filterValue,
    );
  }

  getAllMember() {
    this.memberService.getAllMember().subscribe(
      (data) => {
        this.members = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  clear() {
    this.bookingForm.reset();
    this.filterUser();
  }

  bookingAdd() {
    const dialogRef = this.dialog.open(DialogSubmitBookingComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.bookingRequest.fullName = this.bookingForm.get('fullName').value;
        this.bookingRequest.address = this.bookingForm.get('address').value;
        this.bookingRequest.email = this.bookingForm.get('email').value;
        this.bookingRequest.phone = this.bookingForm.get('phone').value;
        this.bookingRequest.description = this.bookingForm.get('description').value;
        this.bookingRequest.id_user = this.bookingForm.get('id_user').value;
        this.bookingRequest.id_house = this.bookingForm.get('id_house').value;
        this.bookingRequest.price = this.bookingForm.get('price').value;
        this.bookingRequest.deposit = this.bookingForm.get('deposit').value;
        this.bookingRequest.dateIn = this.datePipe.transform(this.bookingForm.get('dateIn').value, 'yyyy-MM-dd');
        this.bookingRequest.dateOut = this.datePipe.transform(this.bookingForm.get('dateOut').value, 'yyyy-MM-dd');

        this.bookingService.createBooking(this.bookingRequest).subscribe(
          (data) => {
            this.toastService.showToast('success', 'Thành công', 'Đặt lịch thành công');
            this.clear();
          },
          (error) => {
            this.toastService.showToast('danger', 'Thất bại', error.error.message);
          },
        );
      }
    });
  }

  endChange(event: MatDatepickerInputEvent<any>) {
    if (event.value === null) {
    } else {
      const countDate = (new Date(event.value).getTime() - new Date(this.bookingForm.get('dateIn').value).getTime()) / 1000 / 60 / 60 / 24;
      const price = this.houses.find((options) => options.id === this.bookingForm.get('id_house').value).price;
      this.bookingForm.get('price').setValue(Number(countDate) * Number(price));
    }
  }

  loadPrice() {
    this.bookingForm.get('dateIn').setValue(null);
    this.bookingForm.get('dateOut').setValue(null);
    this.bookingForm.get('price').setValue(null);
    this.bookingService.checkBookingByHouse(this.bookingForm.get('id_house').value).subscribe(
      (data) => {
        this.dateLock = data;
      },
      (error) => {
      },
    );
  }

  addMember() {
    const dialogRef = this.dialog.open(AddMemberComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
      }
    });
  }
}
