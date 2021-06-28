import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {throwError} from 'rxjs';
import {HouseResponse} from '../../../shared/model/house/house-response';
import {HouseService} from '../../../shared/service/house.service';
import {EditHouseComponent} from './edit-house/edit-house.component';
import {AddHouseComponent} from './add-house/add-house.component';
import {UtilityService} from '../../../shared/service/utility.service';
import {UtilityResponse} from '../../../shared/model/utility/utility-response';
import {ViewResponse} from '../../../shared/model/view/view-response';
import {ViewService} from '../../../shared/service/view.service';
import {DialogDeleteSubmitComponent} from '../../../shared/component/dialog-submit-delete/dialog-submit-delete.component';
import {ToastService} from '../../../shared/service/toast.service';
import {DialogSubmitLockComponent} from '../../../shared/component/dialog-submit-lock/dialog-submit-lock.component';
import {DialogSubmitUnlockComponent} from '../../../shared/component/dialog-submit-unlock/dialog-submit-unlock.component';
import {DetailHouseComponent} from './detail-house/detail-house.component';

@Component({
  selector: 'ngx-list-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss'],
})

export class HouseComponent implements OnInit {
  houses: HouseResponse[];
  utilitys: UtilityResponse[];
  views: ViewResponse[];

  constructor(
    private houseService: HouseService,
    private utilityService: UtilityService,
    private viewService: ViewService,
    private toastrService: ToastService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.getAllHouse();
    this.getAllUtility();
    this.getAllView();
  }

  getAllHouse() {
    this.houseService.getAllHouseByUser().subscribe(
      (data) => {
        this.houses = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  getAllUtility() {
    this.utilityService.getAllUtility().subscribe(
      (data) => {
        this.utilitys = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  getAllView() {
    this.viewService.getAllView().subscribe(
      (data) => {
        this.views = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  addHouse() {
    const dialogRef = this.dialog.open(AddHouseComponent, {
      data: {utilitys: this.utilitys, views: this.views},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getAllHouse();
      }
    });
  }

  editHouse(idHouse) {
    const dialogRef = this.dialog.open(EditHouseComponent, {
      data: {id: idHouse, views: this.views, utilitys: this.utilitys},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getAllHouse();
      }
    });
  }

  deleteHouse(id) {
    const dialogRef = this.dialog.open(DialogDeleteSubmitComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.houseService.deleteHouse(id).subscribe(
          (data) => {
            this.toastrService.showToast('success', 'Thành công', 'Xóa thành công');
            this.getAllHouse();
          },
          (error) => {
            this.toastrService.showToast('danger', 'Thất bại', 'Nhà đã tồn tại hóa đơn');
            throwError(error);
          },
        );
      }
    });
  }

  checked(house) {
    if (house.status === true) {
      this.lockHouse(house.id);
    } else {
      this.unlockHouse(house.id);
    }
    this.getAllHouse();
  }

  lockHouse(id) {
    const dialogRef = this.dialog.open(DialogSubmitLockComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.houseService.lockHouse(id).subscribe(
          (data) => {
            this.toastrService.showToast('success', 'Thành công', 'Khóa thành công');
            this.getAllHouse();
          },
          (error) => {
            this.toastrService.showToast('danger', 'Thất bại', 'Khóa thất bại');
            throwError(error);
          },
        );
      }
    });
  }

  unlockHouse(id) {
    const dialogRef = this.dialog.open(DialogSubmitUnlockComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.houseService.unlockHouse(id).subscribe(
          (data) => {
            this.toastrService.showToast('success', 'Thành công', 'Mở khóa thành công');
            this.getAllHouse();
          },
          (error) => {
            this.toastrService.showToast('danger', 'Thất bại', 'Mở khóa thất bại');
            throwError(error);
          },
        );
      }
    });
  }

  detailHouse(id: number) {
    const dialogRef = this.dialog.open(DetailHouseComponent, {
      data: {
        house: this.houses.find(value => {
          if (value.id === id) {
            return value;
          }
        }),
      }, width: '1000px',
    });
  }
}
