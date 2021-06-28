import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {Observable, throwError} from 'rxjs';
import {HouseRequest} from '../../../../shared/model/house/house-request';
import {HouseService} from '../../../../shared/service/house.service';
import '../../../../shared/ckeditor.loader';
import 'ckeditor';
import {DetailViewRequest} from '../../../../shared/model/detail-view/detail-view-request';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {DetailViewResponse} from '../../../../shared/model/detail-view/detail-view-response';
import {DetailViewService} from '../../../../shared/service/detail-view.service';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ToastService} from '../../../../shared/service/toast.service';
import {DetailUtilityRequest} from '../../../../shared/model/detail-utility/detail-utility-request';
import {DetailUtilityResponse} from '../../../../shared/model/detail-utility/detail-utility-response';
import {DetailUtilityService} from '../../../../shared/service/detail-utility.service';
import {EditDetailUtilityComponent} from "../edit-detail-utility/edit-detail-utility.component";

export interface View {
  id: number;
  viewName: string;
  image: string;
}

export interface Utility {
  id: number;
  utilityName: string;
  id_typeUtility: number;
  image: string;
}

export class Images {
  image: string;
  thumbImage: string;
}

@Component({
  selector: 'ngx-add-edit-house',
  templateUrl: './edit-house.component.html',
  styleUrls: ['./edit-house.component.scss'],
})
export class EditHouseComponent implements OnInit {
  panelOpenState = false;
  houseForm: FormGroup;
  houseRequest: HouseRequest;
  detailViewRequest: DetailViewRequest;
  detailUtilityRequest: DetailUtilityRequest;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredViews: Observable<string[]>;
  filteredUtilitys: Observable<string[]>;
  detailViews: DetailViewResponse[];
  detailUtilitys: DetailUtilityResponse[];
  allView: View[] = this.data.views;
  allUtility: Utility[] = this.data.utilitys;
  inputViewName = new FormControl();
  inputUtilityName = new FormControl();
  @ViewChild('InputView') InputView: ElementRef;
  @ViewChild('InputUtility') InputUtility: ElementRef;
  image: Images[] = [];
  files: any[];

  constructor(
    private toastrService: ToastService,
    private dialogRef: MatDialogRef<EditHouseComponent>,
    private houseService: HouseService,
    @Inject(MAT_DIALOG_DATA) private data,
    private detailViewService: DetailViewService,
    private detailUtilityService: DetailUtilityService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.houseRequest = {
      id: undefined,
      houseName: null,
      capacity: undefined,
      price: undefined,
      size: undefined,
      image: null,
      amountRoom: undefined,
      description: null,
    };
    this.detailViewRequest = {
      id: undefined,
      id_house: undefined,
      id_view: undefined,
    };
    this.detailUtilityRequest = {
      id: undefined,
      id_house: undefined,
      id_utility: undefined,
      quantity: undefined,
    };
    this.houseForm = new FormGroup({
      id: new FormControl(null),
      houseName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      capacity: new FormControl(0, [Validators.required, Validators.min(0)]),
      size: new FormControl(0, [Validators.required, Validators.min(0)]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      image: new FormControl(null),
      amountRoom: new FormControl(0, [Validators.required, Validators.min(0)]),
      description: new FormControl(null),
    });
    this.getHouseById();
    this.getAllDetailUtility();
    this.getAllDetailView();
    this.filteredUtilitys = this.inputUtilityName.valueChanges.pipe(
      startWith(null),
      map((utility: string | null) =>
        utility ? this._filterUtility(utility) : this.allUtility.slice(),
      ),
    );
    this.filteredViews = this.inputViewName.valueChanges.pipe(
      startWith(null),
      map((view: string | null) =>
        view ? this._filterView(view) : this.allView.slice(),
      ),
    );
  }

  removeUtility(id): void {
    this.deleteDetailUtility(id);
  }

  selectedUtility(event: MatAutocompleteSelectedEvent): void {
    this.createDetailUtility(event.option.value);
    this.InputUtility.nativeElement.value = '';
    this.inputUtilityName.setValue(null);
  }

  private _filterUtility(value: any): any[] {
    return this.allUtility.filter((fruit) =>
      fruit.utilityName.toString().toLowerCase().includes(value.toString().toLowerCase()),
    );
  }

  getAllDetailUtility() {
    this.detailUtilityService.getAllDetailUtility(this.data.id).subscribe(
      (data) => {
        this.detailUtilitys = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  createDetailUtility(value) {
    this.detailUtilityRequest.id_house = this.data.id;
    this.detailUtilityRequest.id_utility = value;
    this.detailUtilityService
      .createDetailUtility(this.detailUtilityRequest)
      .subscribe(
        (data) => {
          this.getAllDetailUtility();
        },
        (error) => {
          throwError(error);
        },
      );
  }

  editDetailUtility(value: number) {
    const dialogRef = this.dialog.open(EditDetailUtilityComponent, {data: value});
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getAllDetailUtility();
      }
    });
  }

  deleteDetailUtility(id: number) {
    this.detailUtilityService.deleteDetailUtility(id).subscribe(
      (data) => {
        this.getAllDetailUtility();
      },
      (error) => {
        throwError(error);
      },
    );
  }


  removeView(id): void {
    this.deleteDetailView(id);
  }

  selectedView(event: MatAutocompleteSelectedEvent): void {
    this.createDetailView(event.option.value);
    this.InputView.nativeElement.value = '';
    this.inputViewName.setValue(null);
  }

  private _filterView(value: any): any[] {
    return this.allView.filter((fruit) =>
      fruit.viewName.toString().toLowerCase().includes(value.toString().toLowerCase()),
    );
  }

  getAllDetailView() {
    this.detailViewService.getAllDetailView(this.data.id).subscribe(
      (data) => {
        this.detailViews = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  createDetailView(value) {
    this.detailViewRequest.id_house = this.data.id;
    this.detailViewRequest.id_view = value;
    this.detailViewService
      .createDetailView(this.detailViewRequest)
      .subscribe(
        (data) => {
          this.getAllDetailView();
        },
        (error) => {
          throwError(error);
        },
      );
  }

  deleteDetailView(id: number) {
    this.detailViewService.deleteDetailView(id).subscribe(
      (data) => {
        this.getAllDetailView();
      },
      (error) => {
        throwError(error);
      },
    );
  }

  getHouseById() {
    this.houseService.getHouseById(this.data.id).subscribe(
      (data) => {
        this.houseForm.patchValue(data);
        this.image = JSON.parse(data.image);
      },
      (error) => {
        throwError(error);
      },
    );
  }

  updateHouse() {
    this.houseRequest.id = this.houseForm.get('id').value;
    this.houseRequest.houseName = this.houseForm.get('houseName').value;
    this.houseRequest.capacity = this.houseForm.get('capacity').value;
    this.houseRequest.size = this.houseForm.get('size').value;
    this.houseRequest.price = this.houseForm.get('price').value;
    this.houseRequest.image = this.houseForm.get('image').value;
    this.houseRequest.amountRoom = this.houseForm.get('amountRoom').value;
    this.houseRequest.description = this.houseForm.get('description').value;

    this.houseService
      .updateHouse(this.houseRequest)
      .subscribe(
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

  deleteImage($event: number) {
    this.image.splice($event, 1);
    this.houseForm.get('image').setValue(JSON.stringify(this.image.map((function (item) {
      return {image: item.image, thumbImage: item.thumbImage};
    }))));
  }

  getImage($event: string) {
    const data: Images = <Images>{image: $event, thumbImage: $event};
    this.image.push(data);
    this.houseForm.get('image').setValue(JSON.stringify(this.image.map((function (item) {
      return {image: item.image, thumbImage: item.thumbImage};
    }))));
  }

}
