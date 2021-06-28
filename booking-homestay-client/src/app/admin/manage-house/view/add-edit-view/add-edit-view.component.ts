import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {throwError} from 'rxjs';
import {ViewService} from '../../../../shared/service/view.service';
import {ViewRequest} from '../../../../shared/model/view/view-request';
import {ToastService} from '../../../../shared/service/toast.service';

@Component({
  selector: 'ngx-add-edit-view',
  templateUrl: './add-edit-view.component.html',
  styleUrls: ['./add-edit-view.component.scss'],
})
export class AddEditViewComponent implements OnInit {

  viewForm: FormGroup;
  viewRequest: ViewRequest;
  idView: number;

  constructor(
    private viewService: ViewService,
    private toastrService: ToastService,
    private dialogRef: MatDialogRef<AddEditViewComponent>,
    @Inject(MAT_DIALOG_DATA) private id: number,
  ) {
    this.idView = id;
  }

  ngOnInit(): void {
    this.viewRequest = {
      id: undefined,
      viewName: null,
      image: null,

    };
    this.viewForm = new FormGroup({
      id: new FormControl(null),
      viewName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      image: new FormControl(null),
    });
    if (this.idView) {
      this.getTypeViewById();
    }
  }

  getTypeViewById() {
    this.viewService.getViewById(this.id).subscribe(
      (data) => {
        this.viewForm.patchValue(data);
      },
      (error) => {
        throwError(error);
      },
    );
  }

  submitAction() {
    if (this.idView) {
      this.updateView();
    } else {
      this.createView();
    }
  }

  createView() {
    this.viewRequest.viewName = this.viewForm.get('viewName').value;
    this.viewRequest.image = this.viewForm.get('image').value;
    this.viewService.createView(this.viewRequest).subscribe(
      (data) => {
        this.dialogRef.close(true);
        this.toastrService.showToast('success', 'Thành công', 'Thêm thành công');
      },
      (error) => {
        this.toastrService.showToast('danger', 'Thất bại', error.error.message);
        throwError(error);
      },
    );
  }

  updateView() {
    this.viewRequest.id = this.viewForm.get('id').value;
    this.viewRequest.viewName = this.viewForm.get('viewName').value;
    this.viewRequest.image = this.viewForm.get('image').value;

    this.viewService.updateView(this.viewRequest).subscribe(
      (data) => {
        this.dialogRef.close(true);
        this.toastrService.showToast('success', 'Thành công', 'Sửa thành công');
      },
      (error) => {
        throwError(error);
        this.toastrService.showToast('danger', 'Thất bại', error.error.message);
      },
    );
  }

  getImage(url: string) {
    this.viewForm.get('image').setValue(url);
  }

}
