import { Component, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SupportUsersService } from 'src/app/helpers/services/admin/support-users/support-users.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'src/app/helpers/services/core/message.service';
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { UsersService } from 'src/app/helpers/services/users/users.service';

export interface SupportUsers {
  userId: string
  userName: string
  firstName: string
  lastName: string
  roles: string
}

@Component({
  selector: 'app-support-users',
  templateUrl: './support-users.component.html',
  styleUrls: ['./support-users.component.scss']
})
export class SupportUsersComponent implements AfterViewInit {

  defaultRoles: string[] = ["SUPPORT ADMIN", "SUPPORT CRUD", "SUPPORT READ"];
  displayedColumns: string[] = ['userId', 'userName', 'firstName', 'lastName', 'roles', 'action'];
  dataSource: MatTableDataSource<SupportUsers>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dialogRef: any;
  @ViewChild('addUserTemplate') addUserDialog!: TemplateRef<any>;
  @ViewChild('updateUserTemplate') updateUserDialog!: TemplateRef<any>;
  @ViewChild('deleteUserTemplate') deleteUserDialog!: TemplateRef<any>;


  userId: any;
  userName: any;
  firstName: any;
  lastName: any;
  roles: any;
  email: any;
  usersearchType: any;
  updateForm: FormGroup;
  addForm: FormGroup;
  payload: any = {};
  userFound: any;
  supportUserFound: any;
  showFields: any = false;

  constructor(private _supportUserService: SupportUsersService, public message: MessageService,public _loader: LoaderService, public dialog: MatDialog, private _fb: FormBuilder, private _users: UsersService) {
    this.getAllSupportUsers();
    this.dataSource = new MatTableDataSource();

    this.userId = new FormControl('', [Validators.required]);
    this.userName = new FormControl('', [Validators.required]);
    this.firstName = new FormControl('', [Validators.required]);
    this.lastName = new FormControl('');
    this.roles = new FormControl([], [Validators.required]);
    this.email = new FormControl('');
    this.usersearchType = new FormControl('');
    this.addForm = this._fb.group({
      userId: this.userId,
      userName: this.userName,
      roles: this.roles,
      firstName: this.firstName,
      lastName: this.lastName,
      usersearchType: this.usersearchType
    });
    this.updateForm = this._fb.group({
      userName: this.userName,
      firstName: this.firstName,
      lastName: this.lastName,
      roles: this.roles,
    });

    this.addForm.get('roles')?.valueChanges.subscribe(value => {
      this.addForm.controls.roles.updateValueAndValidity({ emitEvent: false });
      this.addForm.updateValueAndValidity();
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog1() {
    this.dialogRef = this.dialog.open(this.addUserDialog, {
      data: { formLabel: 'Add User' }
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      this.showFields = false
    });
  }

  openDialog2(obj: any) {
    this.dialogRef = this.dialog.open(this.updateUserDialog, {
      data: { formLabel: 'Update User', ...obj, roles: obj.roles.split(',') }
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      this.updateForm.reset();
      this.addForm.reset();
      this.userFound = null;
      this.supportUserFound = null;
    });
  }

  openDialog3(obj: any) {
    this.dialogRef = this.dialog.open(this.deleteUserDialog, {
      data: { 'id': obj.id, 'firstName': obj.firstName, 'userId': obj.userId },
    });
  }

  getAllSupportUsers(action: any = 'list') {
    this._supportUserService.getSupportUsersList().subscribe((response: any) => {
      if (response.result && response.result.length > 0) {
        const data = response.result;
        this.dataSource.data = data;

        if (action == 'list') {
          this.message.invoke('Support Users list fetched successfully.');
        }
      }
    }, (err) => {
      this.message.invoke('Error fetching support users list.');
    });
  }

searchUser() {
  let request;
  if(this.email.value != null && this.email.value != "") {
    this.payload.email = this.email.value;
     request = {
      request: {
        filters: this.payload,
        limit: 10000,
        fields: [],
        sort_by: {
          createdDate: "desc"
        }
    }
  }
}

if(this.userName.value != null && this.userName.value != "") {
  this.payload.userName = this.userName.value;
  request = {
    request: {
      filters: this.payload,
      limit: 10000,
      fields: [],
      sort_by: {
        createdDate: "desc"
      }
  }
}
}

  if(this.payload.email || this.payload.userName) {
    this._users.getUsersList(request).subscribe((result: any) => {
      if(result.statusCode == 200 && result.response.result.response.count > 0) {
        this.userFound = result.response.result.response.content[0]
        let req = {
          userId: this.userFound.userId
        }
        this._supportUserService.fetchIndividualUser(req).subscribe((response: any) => {
          if(response.responseCode == 200 && response.result.length > 0) {
            this.supportUserFound = response.result[0]
            this.dialogRef.close()
            this.openDialog2(this.supportUserFound)
          } else {
            this.showFields = true;
            this.addForm.patchValue ({
              userId: this.userFound.userId,
              firstName: this.userFound.firstName,
              lastName: this.userFound.lastName || '',
              userName: this.userFound.userName
            });
            this.supportUserFound =null
          }
        }, (error: any) => {
          this.message.invoke('Something went wrong. Please, try again.');
        })
      } else {
        this.userFound = null
        this.message.invoke('User not found. Please, try again.');
      }
    }, (error: any) => {
      this.message.invoke('Something went wrong. Please, try again.');
    })
    // this.email.value = null;
    // this.userName.value = null;
    this.payload = {}
  }
}

  OnSubmit(event: any, id: number, userId: string) {
    let $observable;
    let successMsg = '';
    let errorMsg = '';
    if (id) {
      const updateReqBody = {
        username: this.updateForm.value.userName,
        firstName: this.updateForm.value.firstName,
        lastName: this.updateForm.value.lastName,
        roles: this.updateForm.value.roles.length > 0 ? this.updateForm.value.roles.join(',') : ''
      };
      $observable = this._supportUserService.updateSupportUser({ id, userid:userId, ...updateReqBody });
      successMsg = 'User updated successfully.';
      errorMsg = 'Error updating user.';
    } else {
      const addReqBody = {
        userid: this.addForm.value.userId,
        username: this.addForm.value.userName,
        firstName: this.addForm.value.firstName,
        lastName: this.addForm.value.lastName,
        roles: this.addForm.value.roles.length > 0 ? this.addForm.value.roles.join(',') : ''
      };
      $observable = this._supportUserService.addNewSupportUser(addReqBody);
      successMsg = 'User added successfully.';
      errorMsg = 'Error adding new user.';
    }

    $observable.subscribe(
      (resp: any) => {
        if (resp.responseCode === 200 && resp.result) {
          this.getAllSupportUsers('addUpdate');
          this.message.invoke(successMsg);
          this.addForm.reset();
          this.updateForm.reset();
        } else {
          this.message.invoke(errorMsg);
        }
      }, (err) => {
        this.message.invoke(errorMsg);
      });
    this.dialogRef.close();
  }

  userDelete(data: any) {
    if (!data) {
      this.message.invoke('Selected user doesn\'t exist.');
      return;
    }

    this._supportUserService.deleteSupportUser(data).subscribe(
      (resp: any) => {
        if (resp.responseCode === 200 && resp.result) {
          this.getAllSupportUsers('delete');
          this.message.invoke('User deleted successfully.');
        } else {
          this.message.invoke('Error deleting user.');
        }
      }, (err) => {
        this.message.invoke('Error deleting user.');
      });

    this.dialogRef.close();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
