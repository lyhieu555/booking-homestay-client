import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {LocalDataSource, Ng2SmartTableComponent} from 'ng2-smart-table';
import {MatDialog} from '@angular/material/dialog';
import {throwError} from 'rxjs';
import {ViewService} from '../../../shared/service/view.service';
import {AddEditViewComponent} from "./add-edit-view/add-edit-view.component";
import {DialogDeleteSubmitComponent} from "../../../shared/component/dialog-submit-delete/dialog-submit-delete.component";
import {ToastService} from "../../../shared/service/toast.service";

@Component({
  selector: 'ngx-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit, AfterViewInit {

  listView: LocalDataSource = new LocalDataSource();
  @ViewChild('table')
  smartTable: Ng2SmartTableComponent;

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
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      image: {
        title: 'Hình ảnh',
        type: 'html',
        valuePrepareFunction: (value) => {
          return `<img src="${value}"  width="150px" height="150px" alt="Display error">`;
        },
        width: '10%',
      },
      viewName: {
        title: 'Tên cảnh quan',
        type: 'string',
      },
    },
    mode: 'external',
  };

  constructor(
    private dialog: MatDialog,
    private viewService: ViewService,
    private toastrService: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.getAllView();
  }

  getAllView() {
    this.viewService.getAllView().subscribe(
      (data) => {
        this.listView.load(data);
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

  openAdd() {
    const dialogRef = this.dialog.open(AddEditViewComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getAllView();
      }
    });
  }

  openEdit(id: number) {
    const dialogRef = this.dialog.open(AddEditViewComponent, {
      data: id,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getAllView();
      }
    });
  }

  onDelete(id_user: number) {
    const dialogRef = this.dialog.open(DialogDeleteSubmitComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.viewService.deleteView(id_user).subscribe(
          (data) => {
            this.getAllView();
            this.toastrService.showToast('success', 'Thành công', 'Xóa thành công');
          },
          (error) => {
            throwError(error);
            this.toastrService.showToast('danger', 'Thất bại', 'Cảnh quan đã có trong nhà');
          },
        );
      }
    });
  }
}
