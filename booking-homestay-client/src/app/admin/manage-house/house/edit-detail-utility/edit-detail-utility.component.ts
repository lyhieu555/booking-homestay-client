import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DetailUtilityRequest} from '../../../../shared/model/detail-utility/detail-utility-request';
import {ToastService} from '../../../../shared/service/toast.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DetailUtilityService} from '../../../../shared/service/detail-utility.service';
import {throwError} from 'rxjs';

@Component({
  selector: 'ngx-edit-detail-utility',
  templateUrl: './edit-detail-utility.component.html',
  styleUrls: ['./edit-detail-utility.component.scss'],
})
export class EditDetailUtilityComponent implements OnInit {
  detailUtilityForm: FormGroup;
  detailUtilityRequest: DetailUtilityRequest;

  constructor(private toastrService: ToastService,
              private dialogRef: MatDialogRef<EditDetailUtilityComponent>,
              private detailUtilityService: DetailUtilityService,
              @Inject(MAT_DIALOG_DATA) private id: number) {
  }

  ngOnInit(): void {
    this.detailUtilityRequest = {
      id: undefined,
      id_house: undefined,
      quantity: undefined,
      id_utility: undefined,
    },
      this.detailUtilityForm = new FormGroup({
        id: new FormControl(null),
        quantity: new FormControl(1, Validators.min(1)),
      });
    this.getDetailUtilityById();
  }

  getDetailUtilityById() {
    this.detailUtilityService.getDetailUtilityById(this.id).subscribe(
      (data) => {
        this.detailUtilityForm.patchValue(data);
      },
      (error) => {
        throwError(error);
      },
    );
  }

  updateDetailUtility() {
    this.detailUtilityRequest.id = this.detailUtilityForm.get('id').value;
    this.detailUtilityRequest.quantity = this.detailUtilityForm.get(
      'quantity',
    ).value;
    this.detailUtilityService
      .updateDetailUtility(this.detailUtilityRequest)
      .subscribe(
        (data) => {
          this.dialogRef.close(true);
        },
        (error) => {
          throwError(error);
        },
      );
  }

}
