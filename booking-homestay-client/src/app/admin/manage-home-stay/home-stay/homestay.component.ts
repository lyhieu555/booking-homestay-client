import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {LocalDataSource, Ng2SmartTableComponent} from 'ng2-smart-table';
import {throwError} from 'rxjs';
import {HomeStayService} from '../../../shared/service/homestay.service';
import {AddressService} from '../../../shared/service/address.service';
import {AddEditHomeStayComponent} from './add-edit-home-stay/add-edit-home-stay.component';
import {VillageResponse} from '../../../shared/model/village/village-response';
import {MatDialog} from '@angular/material/dialog';
import {DialogSubmitLockComponent} from '../../../shared/component/dialog-submit-lock/dialog-submit-lock.component';
import {ToastService} from '../../../shared/service/toast.service';
import {CityResponse} from '../../../shared/model/city/city-response';
import {DistrictResponse} from '../../../shared/model/district/district-response';
import {PlaceResponse} from "../../../shared/model/place/place-response";
import {PlaceService} from "../../../shared/service/place.service";
import {DialogSubmitUnlockComponent} from "../../../shared/component/dialog-submit-unlock/dialog-submit-unlock.component";

@Component({
  selector: 'ngx-list-homestay',
  templateUrl: './homestay.component.html',
  styleUrls: ['./homestay.component.scss'],
})
export class HomestayComponent implements OnInit, AfterViewInit {
  selectPlace: number;
  listHomeStay: LocalDataSource = new LocalDataSource();
  listHomeStayLock: LocalDataSource = new LocalDataSource();
  @ViewChild('table')
  smartTable: Ng2SmartTableComponent;
  villages: VillageResponse[];
  citys: CityResponse[];
  districts: DistrictResponse[];
  places: PlaceResponse[];

  settingsTable = {
    actions: {
      columnTitle: '',
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-locked"></i>',
      confirmDelete: true,
    },
    columns: {
      homeStayName: {
        title: 'T??n Home stay',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="/admin/manage-homestay/detail/${row.id}">${row.homeStayName}</a>`;
        },
      },
      phone: {
        title: 'S??? ??i???n tho???i',
        type: 'string',
      },
      address: {
        title: '?????a ch???',
        type: 'string',
        valuePrepareFunction: (cell, row) => {
          const address = row.villageName + ' - ' + row.districtName + ' - ' + row.cityName;
          return address;
        },
      },
    },
    mode: 'external',
  };

  settingsTableLock = {
    actions: {
      columnTitle: '',
      edit: false,
      add: false,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-locked"></i>',
      confirmDelete: true,
    },
    columns: {
      homeStayName: {
        title: 'T??n Home stay',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return `<a href="/admin/manage-homestay/detail/${row.id}">${row.homeStayName}</a>`;
        },
      },
      phone: {
        title: 'S??? ??i???n tho???i',
        type: 'string',
      },
      address: {
        title: '?????a ch???',
        type: 'string',
        valuePrepareFunction: (cell, row) => {
          const address = row.villageName + ' - ' + row.districtName + ' - ' + row.cityName;
          return address;
        },
      },
    },
  };

  constructor(
    private dialog: MatDialog,
    private homeStayService: HomeStayService,
    private addressService: AddressService,
    private toastrService: ToastService,
    private placeService: PlaceService,
  ) {
  }

  ngOnInit(): void {
    this.getAllHomeStay();
    this.getAllHomeStayLock();
    this.getAllVillage();
    this.getAllDistrict();
    this.getAllCity();
    this.getAllPlace();
  }

  getAllHomeStay() {
    this.homeStayService.getAllHomeStay().subscribe(
      (data) => {
        this.listHomeStay.load(data);
      },
      (error) => {
        throwError(error);
      },
    );
  }

  getAllHomeStayLock() {
    this.homeStayService.getAllHomeStayLock().subscribe(
      (data) => {
        this.listHomeStayLock.load(data);
      },
      (error) => {
        throwError(error);
      },
    );
  }

  getAllVillage() {
    this.addressService.getAllVillage().subscribe(
      (data) => {
        this.villages = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  getAllDistrict() {
    this.addressService.getAllDistrict().subscribe(
      (data) => {
        this.districts = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  getAllCity() {
    this.addressService.getAllCity().subscribe(
      (data) => {
        this.citys = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  getAllPlace() {
    this.placeService.getAllPlace().subscribe(
      (data) => {
        this.places = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  ngAfterViewInit(): void {
    this.smartTable.edit.subscribe((node: any) => {
      this.openEdit(node.data.id);
    });
    this.smartTable.delete.subscribe((node: any) => {
      this.onDelete(node.data.id);
    });
    this.smartTable.create.subscribe((node: any) => {
      this.openAdd();
    });
  }

  onUnlock(event): void {
    const dialogRef = this.dialog.open(DialogSubmitUnlockComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.homeStayService.unlockHomeStay(event.data.id).subscribe(
          (data) => {
            this.getAllHomeStay();
            this.getAllHomeStayLock();
            this.toastrService.showToast('success', 'Th??nh c??ng', 'M??? kh??a th??nh c??ng');
          },
          (error) => {
            throwError(error);
            this.toastrService.showToast('danger', 'Th???t b???i', 'M??? kh??a th???t b???i');
          },
        );
      }
    });
  }

  openAdd() {
    const dialogRef = this.dialog.open(AddEditHomeStayComponent, {
      data: {village: this.villages, city: this.citys, district: this.districts, places: this.places}, width: '750px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getAllHomeStay();
      }
    });
  }

  openEdit(id: number) {
    const dialogRef = this.dialog.open(AddEditHomeStayComponent, {
      data: {id: id, village: this.villages, city: this.citys, district: this.districts, places: this.places}, width: '750px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getAllHomeStay();
      }
    });
  }

  onDelete(id_user: number) {
    const dialogRef = this.dialog.open(DialogSubmitLockComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.homeStayService.deleteHomeStay(id_user).subscribe(
          (data) => {
            this.getAllHomeStay();
            this.getAllHomeStayLock();
            this.toastrService.showToast('success', 'Th??nh c??ng', 'Kh??a th??nh c??ng');
          },
          (error) => {
            throwError(error);
            this.toastrService.showToast('danger', 'Th???t b???i', 'Kh??a th???t b???i');
          },
        );
      }
    });
  }
}
