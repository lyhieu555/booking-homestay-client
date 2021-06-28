import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { HomeStayResponse } from '../../../../shared/model/home-stay/home-stay-response';
import { HomeStayService } from '../../../../shared/service/homestay.service';
import { EmployeeRequest } from '../../../../shared/model/employee/employee-request';
import { EmployeeService } from '../../../../shared/service/employee-service.service';
import {ToastService} from "../../../../shared/service/toast.service";

@Component({
  selector: 'ngx-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employeeRequest: EmployeeRequest;
  homeStays: HomeStayResponse[];

  constructor(
    private employeeService: EmployeeService,
    private homeStayService: HomeStayService,
    private toastrService: ToastService,
    private dialogRef: MatDialogRef<AddEmployeeComponent>,
  ) {}

  ngOnInit(): void {
    this.getAllHomeStay();
    this.employeeRequest = {
      id: undefined,
      userName: null,
      id_homeStay: undefined,
      email: null,
      phone: null,
      firstName: null,
      lastName: null,
      address: null,
      dateOfBirth: undefined,
      sex: null,
    };
    this.employeeForm = new FormGroup({
      userName: new FormControl(null, [Validators.minLength(4), Validators.maxLength(20), Validators.required, Validators.pattern('[a-zA-Z0-9]*'), Validators.pattern(/^\S*$/)]),
      id_homeStay: new FormControl('', Validators.required),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/((09|03|07|08|05)+([0-9]{8})\b)/),
        Validators.pattern(/^\S*$/),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  private getAllHomeStay() {
    this.homeStayService.getAllHomeStay().subscribe(
      (data) => {
        this.homeStays = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  createEmployees() {
    this.employeeRequest.userName = this.employeeForm.get('userName').value;
    this.employeeRequest.id_homeStay = this.employeeForm.get(
      'id_homeStay',
    ).value;
    this.employeeRequest.email = this.employeeForm.get('email').value;
    this.employeeRequest.phone = this.employeeForm.get('phone').value;

    this.employeeService.createEmployee(this.employeeRequest).subscribe(
      (data) => {
        this.dialogRef.close(true);
        this.toastrService.showToast('success', 'Thành công', 'Thêm thành công');
      },
      (error) => {
        throwError(error);
        this.toastrService.showToast('danger', 'Thất bại', error.error.message);
      },
    );
  }
  }


