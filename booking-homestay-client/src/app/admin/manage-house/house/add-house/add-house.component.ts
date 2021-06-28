import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {Observable, throwError} from 'rxjs';
import '../../../../shared/ckeditor.loader';
import 'ckeditor';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {map, startWith} from 'rxjs/operators';
import {DetailUtilityResponse} from '../../../../shared/model/detail-utility/detail-utility-response';
import {DetailUtilityService} from '../../../../shared/service/detail-utility.service';
import {DetailUtilityRequest} from '../../../../shared/model/detail-utility/detail-utility-request';
import {MatStepper} from '@angular/material/stepper';
import {ToastService} from '../../../../shared/service/toast.service';
import {HouseService} from '../../../../shared/service/house.service';
import {HouseRequest} from '../../../../shared/model/house/house-request';
import {DetailViewResponse} from '../../../../shared/model/detail-view/detail-view-response';
import {DetailViewRequest} from '../../../../shared/model/detail-view/detail-view-request';
import {DetailViewService} from '../../../../shared/service/detail-view.service';
import {EditDetailUtilityComponent} from "../edit-detail-utility/edit-detail-utility.component";

export interface Utility {
  id: number;
  utilityName: string;
  id_typeUtility: number;
  image: string;
}

export interface View {
  id: number;
  viewName: string;
  image: string;
}

export class Images {
  image: string;
  thumbImage: string;
}


@Component({
  selector: 'ngx-add-house',
  templateUrl: './add-house.component.html',
  styleUrls: ['./add-house.component.scss'],
})
export class AddHouseComponent implements OnInit {
  houseForm: FormGroup;
  houseRequest: HouseRequest;
  detailUtilityRequest: DetailUtilityRequest;
  detailViewRequest: DetailViewRequest;
  idHouse: number;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredViews: Observable<string[]>;
  filteredUtilitys: Observable<string[]>;
  detailViews: DetailViewResponse[];
  detailUtilitys: DetailUtilityResponse[];
  allUtility: Utility[] = this.data.utilitys;
  allView: View[] = this.data.views;
  inputUtilityName = new FormControl();
  inputViewName = new FormControl();
  @ViewChild('InputView') InputView: ElementRef;
  @ViewChild('InputUtility') InputUtility: ElementRef;
  image: Images[] = [];
  files: any[];

  constructor(
    private toastrService: ToastService,
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<AddHouseComponent>,
    private houseService: HouseService,
    private detailUtilityService: DetailUtilityService,
    private detailViewService: DetailViewService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.houseRequest = {
      id: undefined,
      houseName: null,
      capacity: undefined,
      size: undefined,
      price: undefined,
      image: null,
      amountRoom: undefined,
      description: null,
    };
    this.detailUtilityRequest = {
      id: undefined,
      id_house: undefined,
      id_utility: undefined,
      quantity: undefined,
    };
    this.detailViewRequest = {
      id: undefined,
      id_house: undefined,
      id_view: undefined,
    };
    this.houseForm = new FormGroup({
      id: new FormControl(null),
      houseName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      capacity: new FormControl(0, [Validators.required, Validators.min(0)]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      size: new FormControl(0, [Validators.required, Validators.min(0)]),
      image: new FormControl('[]'),
      amountRoom: new FormControl(0, [Validators.required, Validators.min(0)]),
      description: new FormControl(null),

    });
    this.filteredViews = this.inputViewName.valueChanges.pipe(
      startWith(null),
      map((view: string | null) =>
        view ? this._filterView(view) : this.allView.slice(),
      ),
    );
    this.filteredUtilitys = this.inputUtilityName.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allUtility.slice(),
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

  private _filter(value: any): any[] {
    return this.allUtility.filter((fruit) =>
      fruit.utilityName.toString().toLowerCase().includes(value.toString().toLowerCase()),
    );
  }

  getAllDetailUtility() {
    this.detailUtilityService.getAllDetailUtility(this.idHouse).subscribe(
      (data) => {
        this.detailUtilitys = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  createDetailUtility(value) {
    this.detailUtilityRequest.id_house = this.idHouse;
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
    this.detailViewService.getAllDetailView(this.idHouse).subscribe(
      (data) => {
        this.detailViews = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  createDetailView(value) {
    this.detailViewRequest.id_house = this.idHouse;
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

  submitAction(stepper: MatStepper) {
    if (this.idHouse) {
      this.updateHouse(stepper);
    } else {
      this.createHouse(stepper);
    }
  }

  createHouse(stepper) {
    this.houseRequest.houseName = this.houseForm.get('houseName').value;
    this.houseRequest.capacity = this.houseForm.get('capacity').value;
    this.houseRequest.price = this.houseForm.get('price').value;
    this.houseRequest.size = this.houseForm.get('size').value;
    this.houseRequest.image = this.houseForm.get('image').value;
    this.houseRequest.amountRoom = this.houseForm.get('amountRoom').value;
    this.houseRequest.description = this.houseForm.get('description').value;

    this.houseService.createHouse(this.houseRequest).subscribe(
      (data) => {
        this.idHouse = data;
        stepper.next();
        this.toastrService.showToast('success', 'Thành công', 'Thêm thành công');
      },
      (error) => {
        throwError(error);
        this.toastrService.showToast('danger', 'Thất bại', error.error.message);
      },
    );
  }

  updateHouse(stepper) {
    this.houseForm.get('id').setValue(this.idHouse);
    this.houseRequest.id = this.houseForm.get('id').value;
    this.houseRequest.houseName = this.houseForm.get('houseName').value;
    this.houseRequest.capacity = this.houseForm.get('capacity').value;
    this.houseRequest.size = this.houseForm.get('size').value;
    this.houseRequest.price = this.houseForm.get('price').value;
    this.houseRequest.image = this.houseForm.get('image').value;
    this.houseRequest.amountRoom = this.houseForm.get('amountRoom').value;
    this.houseRequest.description = this.houseForm.get('description').value;

    this.houseService.updateHouse(this.houseRequest).subscribe(
      (data) => {
        stepper.next();
        this.toastrService.showToast('success', 'Thành công', 'Cập nhật thành công');
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
