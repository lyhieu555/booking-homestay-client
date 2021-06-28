import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { ProfileResponse } from '../../../shared/model/profile/profile.response';
import { ProfileService } from '../../../shared/service/profile.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileResponse: ProfileResponse;

  constructor(
    private profileService: ProfileService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getUserById();
  }

  getUserById() {
    this.profileService.getProfile().subscribe(
      (data) => {
        this.profileResponse = data;
      },
      (error) => {
        throwError(error);
      },
    );
  }

  openEdit() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      data: this.profileResponse, width: '750px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getUserById();
      }
    });
  }
}
