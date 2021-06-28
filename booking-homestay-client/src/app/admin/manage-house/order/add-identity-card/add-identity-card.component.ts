import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from '../../../../shared/service/toast.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BookingRequest} from '../../../../shared/model/booking/booking-request';
import {BookingService} from '../../../../shared/service/booking.service';
import {WebcamImage, WebcamInitError} from 'ngx-webcam';
import {Observable, Subject} from 'rxjs';
import {Images} from '../../../manage-home-stay/home-stay/add-edit-home-stay/add-edit-home-stay.component';

@Component({
  selector: 'ngx-add-identity-card',
  templateUrl: './add-identity-card.component.html',
  styleUrls: ['./add-identity-card.component.scss'],
})
export class AddIdentityCardComponent implements OnInit {
  bookingForm: FormGroup;
  bookingRequest: BookingRequest;
  webCam: boolean = false;
  private trigger: Subject<void> = new Subject<void>();
  image: Images[] = [];
  isCheck: boolean = true;
  files: File[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<AddIdentityCardComponent>,
    private toastrService: ToastService,
    private bookingService: BookingService) {
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
        identityCard: new FormControl('[]'),
      });
    this.bookingForm.get('id').setValue(this.data.id);
  }

  addIdentityCard() {
    this.bookingRequest.id = this.bookingForm.get('id').value;
    this.bookingRequest.identityCard = this.bookingForm.get('identityCard').value;

    this.bookingService.addIdentityCard(this.bookingRequest).subscribe(
      (data) => {
        this.dialogRef.close(true);
      },
      (error) => {
        this.toastrService.showToast('danger', 'Thất bại', 'Thêm thẻ căn cước thất bại');
      },
    );
  }

  check() {
    this.isCheck = !this.isCheck;
  }

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
      this.webCam = true;
    } else {
      this.webCam = false;
    }
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public handleImage(webcamImage: WebcamImage): void {
    const file = this.dataURItoBlob(webcamImage.imageAsBase64);
    const base64 = webcamImage.imageAsBase64;
    const imageName = 'name.png';
    const imageBlob = this.dataURItoBlob(base64);
    const imageFile = new File([imageBlob], imageName, {type: 'image/png'});
    this.files.push(imageFile);
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], {type: 'image/png'});
    return blob;
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
