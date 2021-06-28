import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BookingRequest} from '../../../../shared/model/booking/booking-request';
import {ToastService} from '../../../../shared/service/toast.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BookingService} from '../../../../shared/service/booking.service';
import {throwError} from 'rxjs';
import {HouseService} from '../../../../shared/service/house.service';
import {HouseResponse} from '../../../../shared/model/house/house-response';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {DateAdapter} from '@angular/material/core';
import {DatePipe} from '@angular/common';

export class Images {
  image: string;
  thumbImage: string;
}

@Component({
  selector: 'ngx-edit-order',
  templateUrl: './edit-check-in.component.html',
  styleUrls: ['./edit-check-in.component.scss'],
})
export class EditCheckInComponent implements OnInit {
  bookingForm: FormGroup;
  bookingRequest: BookingRequest;
  houses: HouseResponse[];
  dateLock: string[] = [];
  today = new Date();
  idHouse: number;
  image: Images[] = [];

  constructor(
    private toastrService: ToastService,
    private bookingService: BookingService,
    private houseService: HouseService,
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<EditCheckInComponent>,
    private _adapter: DateAdapter<any>,
    private datePipe: DatePipe,
  ) {
    this._adapter.setLocale('vi');
    this.idHouse = this.data.id;
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
        id: new FormControl(null, Validators.required),
        fullName: new FormControl(null, Validators.maxLength(40)),
        address: new FormControl(null, Validators.maxLength(50)),
        email: new FormControl(null, [Validators.required, Validators.email]),
        phone: new FormControl(null, [Validators.required, Validators.pattern(/((09|03|07|08|05)+([0-9]{8})\b)/), Validators.pattern(/^\S*$/),
        ]),
        description: new FormControl(null),
        id_house: new FormControl(null, Validators.required),
        price: new FormControl({value: null, disabled: true}, Validators.required),
        dateIn: new FormControl(null, Validators.required),
        discount: new FormControl(null),
        costsIncurred: new FormControl(null),
        identityCard: new FormControl(null),
        dateOut: new FormControl(null, Validators.required),
        dateInNew: new FormControl({value: null, disabled: true}, Validators.required),
        dateOutNew: new FormControl({value: null, disabled: true}, Validators.required),
      });
    this.getBookingById();
    this.getAllHouse();
  }

  getBookingById() {
    this.bookingService.getBookingById(this.data.id).subscribe(
      (data) => {
        this.bookingForm.patchValue(data);
        this.image = JSON.parse(data.identityCard);
        this.bookingForm.get('dateIn').setValue(new Date(data.dateIn));
        this.bookingForm.get('dateOut').setValue(new Date(data.dateOut));
        this.bookingForm.get('dateInNew').setValue(new Date(data.dateIn));
        this.bookingForm.get('dateOutNew').setValue(new Date(data.dateOut));
        this.checkDate();
      },
      (error) => {
        throwError(error);
      },
    );
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

  bookingEdit() {
    this.bookingRequest.id = this.bookingForm.get('id').value;
    this.bookingRequest.fullName = this.bookingForm.get('fullName').value;
    this.bookingRequest.address = this.bookingForm.get('address').value;
    this.bookingRequest.email = this.bookingForm.get('email').value;
    this.bookingRequest.phone = this.bookingForm.get('phone').value;
    this.bookingRequest.description = this.bookingForm.get('description').value;
    this.bookingRequest.id_house = this.bookingForm.get('id_house').value;
    this.bookingRequest.costsIncurred = this.bookingForm.get('costsIncurred').value;
    this.bookingRequest.identityCard = this.bookingForm.get('identityCard').value;
    this.bookingRequest.discount = this.bookingForm.get('discount').value;
    this.bookingRequest.price = this.bookingForm.get('price').value;
    this.bookingRequest.dateIn = this.datePipe.transform(this.bookingForm.get('dateInNew').value, 'yyyy-MM-dd');
    this.bookingRequest.dateOut = this.datePipe.transform(this.bookingForm.get('dateOutNew').value, 'yyyy-MM-dd');
    if (this.data.action) {
      this.bookingService.updateBookingNotCheckIn(this.bookingRequest).subscribe(
        (data) => {
          this.toastrService.showToast('success', 'Thành công', 'Sửa lịch thành công');
          this.dialogRef.close(true);
        },
        (error) => {
          this.toastrService.showToast('danger', 'Thất bại', error.error.message);
        },
      );
    } else {
      this.bookingService.updateBooking(this.bookingRequest).subscribe(
        (data) => {
          this.toastrService.showToast('success', 'Thành công', 'Sửa lịch thành công');
          this.dialogRef.close(true);
        },
        (error) => {
          this.toastrService.showToast('danger', 'Thất bại', error.error.message);
        },
      );
    }

  }

  endChange(event: MatDatepickerInputEvent<any>) {
    if (event.value === null) {
    } else {
      const countDate = (new Date(event.value).getTime() - new Date(this.bookingForm.get('dateInNew').value).getTime()) / 1000 / 60 / 60 / 24;
      const price = this.houses.find((options) => options.id === this.bookingForm.get('id_house').value).price;
      this.bookingForm.get('price').setValue(Number(countDate) * Number(price));
    }
  }

  loadPrice() {
    this.bookingForm.get('dateInNew').setValue(null);
    this.bookingForm.get('dateOutNew').setValue(null);
    this.bookingForm.get('price').setValue(null);
    this.checkDate();
  }

  checkDate() {
    this.bookingService.checkBookingByHouseAndBook(this.bookingForm.get('id_house').value,
      this.bookingForm.get('id').value).subscribe(
      (data) => {
        this.dateLock = data;
      },
      (error) => {
      },
    );
  }

  deleteImage($event: number) {
    this.image.splice($event, 1);
    this.bookingForm.get('identityCard').setValue(JSON.stringify(this.image.map((function (item) {
      return {image: item.image, thumbImage: item.thumbImage};
    }))));
  }

  getImage($event: string) {
    const data: Images = <Images>{image: $event, thumbImage: $event};
    this.image.push(data);
    this.bookingForm.get('identityCard').setValue(JSON.stringify(this.image.map((function (item) {
      return {image: item.image, thumbImage: item.thumbImage};
    }))));
  }

}
