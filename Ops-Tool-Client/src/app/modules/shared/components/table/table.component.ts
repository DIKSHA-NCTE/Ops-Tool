import { AfterViewInit, Component, Input, ViewChild, SimpleChanges, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import 'rxjs/add/observable/of';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CourseService } from 'src/app/helpers/services/course/course.service';
import { PopupComponent } from '../popup/popup.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LoaderService } from 'src/app/helpers/utils/loader.service';
import { MessageService } from 'src/app/helpers/services/core/message.service';
import { CertificatesService } from 'src/app/helpers/services/certificates/certificates.service';
import { UsersService } from 'src/app/helpers/services/users/users.service';
import { ConstantsService } from 'src/app/helpers/services/admin/constants/constants.service';
import { FormsService } from 'src/app/helpers/services/forms/forms.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers:[PopupComponent ]
})
export class TableComponent implements AfterViewInit {
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @Input() data: any;
  @Input() columnsToDisplay: any = [];
  @Input() file: any;
  @ViewChild('popupTemplate') popupDialog!: TemplateRef<any>;
  @ViewChild('editUserTemplate') editUserDialog!: TemplateRef<any>;
  @ViewChild('updateRoleTemplate') updateRoleDialog!: TemplateRef<any>;
  @ViewChild('updateExtIdTemplate') updateExtIdDialog!: TemplateRef<any>;
  @ViewChild('formReadTemplate') formReadDialog!: TemplateRef<any>;
  filename: any;
  dialogRef: any;
  batchId: any;
  courseId: any;
  createdFor: any;
  channel: any;
  expandedElement: any;
  recordsCount: any;
  displayedColumns: any;
  userinfoShow: any;
  progressShow: any;
  responseShow: any;
  progressExhaustArr: any;
  isDownloading: any;
  displayActions: any;
  editUserForm: FormGroup;
  updateRoleForm: FormGroup;
  updateExtIdForm: FormGroup;
  userId: any;
  userName: any;
  rootOrgId: any;
  firstName: any;
  lastName: any;
  email: any;
  phone: any;
  orgName: any;
  roles: any;
  id: any;
  idType: any;
  provider: any;
  userDetails: any;
  adminDetails: any;
  payload: any = {};
  idTypes: any = [];
  custodianOrg: string = environment.CUSTODIAN_ORG;
  defaultRoles: string[] = ["BOOK_CREATOR", "BOOK_REVIEWER", "CONTENT_CREATOR", "CONTENT_REVIEWER", "COURSE_MENTOR", "ORG_ADMIN", "REPORT_ADMIN", "REPORT_VIEWER", "PROGRAM_MANAGER", "PROGRAM_DESIGNER", "PUBLIC"];
  defaultIdTypes: string[] = ["declared-phone", "declared-email", "declared-ext-id", "declared-school-name", "declared-school-udise-code"];

  constructor(public dialog: MatDialog, private _courses: CourseService, private _certs: CertificatesService, public popup: PopupComponent, private _loader: LoaderService, public _message: MessageService, private _fb: FormBuilder, private _users: UsersService, private _constantService: ConstantsService, private _forms: FormsService) {
    this.filename = this.file + '_' + this.recordsCount;
    this.userId = new FormControl('', [Validators.required]);
    this.userName = new FormControl('', [Validators.required]);
    this.rootOrgId = new FormControl('', [Validators.required]);
    this.firstName = new FormControl('', [Validators.required]);
    this.lastName = new FormControl('');
    this.email = new FormControl('');
    this.phone = new FormControl('');
    this.orgName = new FormControl('');
    this.roles = new FormControl([], [Validators.required]);
    this.id = new FormControl('', [Validators.required]);
    this.idType = new FormControl('', [Validators.required]);
    this.provider = new FormControl('', [Validators.required]);
    this.adminDetails = new FormControl('', [Validators.required]);
    this.editUserForm = this._fb.group({
      userId: this.userId,
      userName: this.userName,
      rootOrgId: this.rootOrgId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone
    });
    this.updateRoleForm = this._fb.group({
      userId: this.userId,
      userName: this.userName,
      rootOrgId: this.rootOrgId,
      orgName: this.orgName,
      roles: this.roles,
      adminDetails: this.adminDetails
    });
    this.updateExtIdForm = this._fb.group({
      userId: this.userId,
      userName: this.userName,
      rootOrgId: this.rootOrgId,
      orgName: this.orgName,
      id: this.id,
      idType: this.idType,
      provider: this.provider
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    /** Fire any time state changes */
    if (!changes.data.firstChange) {
      this.dataSource = new MatTableDataSource<any>(changes.data.currentValue);
      this.recordsCount = this.dataSource.filteredData.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    this.filename = this.file + '_' + this.recordsCount;
  }

  ngOnInit(): void {
    this.displayedColumns = this.columnsToDisplay.map((c: { columnDef: any; }) => c.columnDef);
    let currentUser: any = localStorage.getItem("currentUser");
    if (JSON.parse(currentUser)?.length > 0) {
      let userRoles = JSON.parse(currentUser)[0].roles.split(',');
      if(userRoles.indexOf('SUPPORT ADMIN') === -1 && userRoles.indexOf('SUPPORT CRUD') === -1) {
        this.displayActions = false;
      } else {
        this.displayActions = true;
      }
  }
}

  ngAfterViewInit() {
    // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.recordsCount = this.dataSource.filteredData.length;
    if (this.recordsCount == 0) {
      this.recordsCount = 'No';
    }
    this.filename = this.file + '_' + this.recordsCount;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.recordsCount = this.dataSource.filteredData.length;
    if (this.recordsCount == 0) {
      this.recordsCount = 'No';
    }
    this.filename = this.file + '_' + this.recordsCount;
  }

  getValueType(value: any) {
    return (typeof value == 'string') ? (value.indexOf('http') !== -1) ? '<a href=' + value + ' target="_blank">Click here</a>' : (value) ? value : '-----' : (typeof value == 'number' && value) ? value : '-----';
  }

  getValueByType(value: any) {
    return (value) ? value : '-----';
  }

  openPopup(element: any) {
    this.isDownloading = false
    this.batchId = ''
    this.batchId = element['batchId']
    this.courseId = ''
    this.courseId = element['courseId']
    this.createdFor = ''
    this.createdFor = element['createdFor']
    this.channel = ''
    this.channel = element['channel']
    this.dialogRef = this.dialog.open(this.popupDialog,{
    });
  }
  
  getExhaustReports(type: any, batchId: any, courseId: any, channelId: any) {
    this.progressExhaustArr = undefined;
    const temp = {
      batchId: batchId,
      courseId: courseId,
      channelId: channelId,
      type: `${type}-exhaust/`
    };

    this._courses.getReportsSet(temp).subscribe((res: any) => {
      if (type === 'progress') {
        this.userinfoShow = false;
        this.progressShow = true;
        this.responseShow = false;
      } else if (type === 'userinfo') {
        this.progressShow = false;
        this.userinfoShow = true;
        this.responseShow = false;
      } else if (type === 'response') {
        this.progressShow = false;
        this.userinfoShow = false;
        this.responseShow = true;
      }

      if (res.statusCode === 200 && res.response.length > 0) {
        this.progressExhaustArr = res.response;
      } else {
        this.progressExhaustArr = [];
      }
    }, (error: any) => {
      this.dialogRef.close()
      this._message.invoke("An error occured. Please, try again.");
    });
  }

  openDialogFirst(element: any, type: any, batchId: any, courseId: any, channelId: any) {
    this.getExhaustReports(type, batchId, courseId, channelId);
    this.openPopup(element);
  }

  onClick(event: MatTabChangeEvent) {
    switch(event.tab.textLabel) {
      case 'Get Progress Exhaust Report':
        this.getExhaustReports('progress', this.batchId, this.courseId, this.channel)
        break;
      case 'Get User-Info Exhaust Report':
        this.getExhaustReports('userinfo', this.batchId, this.courseId, this.channel)
        break;
      case 'Get Response Exhaust Report':
        this.getExhaustReports('response', this.batchId, this.courseId, this.channel)
        break;
    }
  }

  downloadExhaustReport(url: any) {
    this.isDownloading = true
    let request = {
      url: url
    };
    this._courses.downloadReport(request).subscribe((result: any) => {
      if (result.statusCode == 200) {
        const a = document.createElement('a');
          a.href = result.url;
          a.download = result.url.split('/')[2];
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
          this.isDownloading = false
      }
    },
    (error: any) => {
      this._message.invoke("Error downloading report. Please, try again.");
    }
  );
  }

  downloadCertificate(element: any) {
    this._loader.emitLoaderStatus(true);
    let certificateIdentifier = element.certificateUrl
    let certType = element.certificateType
    let request = {
      certificateIdentifier
    }
    if(certType == 'SVG') {
      this._certs.downloadSvgCertificate(request).subscribe((result: any) => {
        if(result.statusCode == 200 && result.response.result.printUri) {
          let svgUri = result.response.result.printUri.trim().replace(/["']{0,}data:image\/svg\+xml,/, ``);
          let blobData;
          try {
            blobData = decodeURIComponent(svgUri)
          } catch {
            blobData = svgUri
          }
          let blob = new Blob([blobData], {type : 'text/html'});
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = element.courseName + '.html';
          a.click();
          window.URL.revokeObjectURL(a.href);
          a.remove();
          this._loader.emitLoaderStatus(false);
        } else {
          this._loader.emitLoaderStatus(false);
          this._message.invoke("An error occured while downloading certificate.");
        }
      }, (error: any) => {
          this._loader.emitLoaderStatus(false);
          this._message.invoke("Something went wrong. Please, try again later.")
      })
    }
    if(certType == 'PDF') {
      this._certs.downloadPdfCertificate(request).subscribe((result: any) => {
        if(result.statusCode == 200 && result.response.result.signedUrl) {
          let pdfUrl = result.response.result.signedUrl;
          const a = document.createElement('a');
          a.href = pdfUrl;
          a.download = element.courseName;
          a.click();
          window.URL.revokeObjectURL(a.href);
          a.remove();
          this._loader.emitLoaderStatus(false);
        } else {
          this._loader.emitLoaderStatus(false);
          this._message.invoke("An error occured while downloading certificate.");
        }
      }, (error: any) => {
          this._loader.emitLoaderStatus(false);
          this._message.invoke("Something went wrong. Please, try again later.")
      })
    }
  }

  getUserDetails(id: any, userName: any): Promise<any> {
    let request = {
      id: id,
      metaInfo: JSON.stringify({ userName: userName })
    };
    return this._users.readUser(request)
    .toPromise()
  }

  getConstantValues(_cons: any) {
    let arrData: any = [];
    const rows = _cons.fvalues.split(",");
    rows.forEach((item: any) => {
      const value = item.split("||")[1];
      arrData.push(value);
    });
    return arrData;
  };

  openEditUserDialog(element: any) {
    this._loader.emitLoaderStatus(true);
    this.getUserDetails(element.identifier, element.userName).then(result => {
      if (result.statusCode == 200 && result.response.result.response !== undefined) {
        let userDetails = result.response.result.response;
        this._loader.emitLoaderStatus(false);
        this.dialogRef = this.dialog.open(this.editUserDialog, {
          data: { formLabel: 'Edit User', ...userDetails }
        });
        this.dialogRef.afterClosed().subscribe((result: any) => {
          this.editUserForm.reset();
          this.payload = {};
        });
      } else {
        this._loader.emitLoaderStatus(false);
        this._message.invoke('Error fetching user details. Please, try again!');
      }
    }).catch(er => {
      this._loader.emitLoaderStatus(false);
      this._message.invoke('Error fetching user details. Please, try again!');
    })
  }

  openUpdateRoleDialog(element: any) {
    this._loader.emitLoaderStatus(true);
    let constant_req = { entity: ["role"] };
    this._constantService.getConstantsData(constant_req).subscribe((response: any) => {
      if (response.statusCode == 200) {
        this.defaultRoles = this.getConstantValues(response.result[0]);
      }
    })
    this.getUserDetails(element.identifier, element.userName).then(result => {
      if (result.statusCode == 200 && result.response.result.response !== undefined) {
        let userDetails = result.response.result.response;
        this._loader.emitLoaderStatus(false);
         this.dialogRef = this.dialog.open(this.updateRoleDialog, {
          data: { formLabel: 'Update Role', ...userDetails }
        });
        this.dialogRef.afterClosed().subscribe((result: any) => {
          this.updateRoleForm.reset();
        });
      } else {
        this._loader.emitLoaderStatus(false);
        this._message.invoke('Error fetching user details. Please, try again!');
      }
    }).catch(er => {
      this._loader.emitLoaderStatus(false);
      this._message.invoke('Error fetching user details. Please, try again!');
    })
  }

  openUpdateExtIdDialog(element: any) {
    this._loader.emitLoaderStatus(true);
    this.idTypes = [...this.defaultIdTypes];
    this.idTypes.push(element.channel);
    this.getUserDetails(element.identifier, element.userName).then(result => {
      if (result.statusCode == 200 && result.response.result.response !== undefined) {
        let userDetails = result.response.result.response;
        this._loader.emitLoaderStatus(false);
        this.dialogRef = this.dialog.open(this.updateExtIdDialog, {
          data: { formLabel: 'Update External ID', ...userDetails }
        });
        this.dialogRef.afterClosed().subscribe((result: any) => {
          this.updateExtIdForm.reset();
        });
      } else {
        this._loader.emitLoaderStatus(false);
        this._message.invoke('Error fetching user details. Please, try again!');
      }
    }).catch(er => {
      this._loader.emitLoaderStatus(false);
      this._message.invoke('Error fetching user details. Please, try again!');
    })
  }

  userDetailPayload(key: any) {
    if (this.editUserForm.value[key].trim() != '' && this.editUserForm.value[key] != null) {
      this.payload[key] = this.editUserForm.value[key].trim();
    } else if (key == 'lastName') {
      this.payload[key] = this.editUserForm.value[key].trim();
    } else {
      delete this.payload[key];
      this.editUserForm.patchValue({ [key]: '' });
    }
  }

  updateUserDetail() {
    this._loader.emitLoaderStatus(true);
    if (Object.keys(this.payload).length !== 0) {
      this.payload['userId'] = this.editUserForm.value['userId'];
      let request = {
        request: this.payload,
        metaInfo: JSON.stringify({ userName: this.editUserForm.value['userName'] })
      };
      this._users.updateUserDetails(request).subscribe((result: any) => {
        if (result.statusCode == 200 && result.response.result.response === 'SUCCESS') {
          this._loader.emitLoaderStatus(false);
          this.dialogRef.close();
          this._message.invoke('User details updated successfully.');
        } else {
          this._loader.emitLoaderStatus(false);
          this._message.invoke(result.response.params.errmsg);
        }
      }, (error: any) => {
        this._loader.emitLoaderStatus(false);
        this._message.invoke('Something went wrong. Please, try again.');
      })
    } else {
      this._loader.emitLoaderStatus(false);
      this._message.invoke('No details to update.');
    }
  }

  updateUserRole() {
    this._loader.emitLoaderStatus(true);
      let request = {
        request: {
          userId: this.updateRoleForm.value['userId'],
          organisationId: this.updateRoleForm.value['rootOrgId'],
          roles: this.updateRoleForm.value['roles']
        },
        metaInfo: JSON.stringify({ userName: this.updateRoleForm.value['adminDetails'] })
      };
      this._users.updateUserRole(request).subscribe((result: any) => {
        if (result.statusCode == 200 && result.response.result.response === 'SUCCESS') {
          this._loader.emitLoaderStatus(false);
          this.dialogRef.close();
          this._message.invoke('User roles updated successfully.');
        } else if (result.statusCode == 400 && result.response == 'You do not have permission to perform this operation')  {
          this._loader.emitLoaderStatus(false);
          this._message.invoke('Please, provide correct admin username');
        } else {
          this._loader.emitLoaderStatus(false);
          this._message.invoke('Error updating user roles');
        }
      }, (error: any) => {
        this._loader.emitLoaderStatus(false);
        this._message.invoke('Something went wrong. Please, try again.');
      })
    }

  updateExtId() {
    this._loader.emitLoaderStatus(true);
    let request = {
      request: {
        userId: this.updateExtIdForm.value['userId'],
        externalIds: [{
          "idType": this.updateExtIdForm.value['idType'],
          "id": this.updateExtIdForm.value['id'],
          "provider": this.updateExtIdForm.value['provider']
        }]
      },
      metaInfo: JSON.stringify({ userName: this.updateExtIdForm.value['userName'] })
    };
    this._users.updateUserDetails(request).subscribe((result: any) => {
      if (result.statusCode == 200 && result.response.result.response === 'SUCCESS') {
        this._loader.emitLoaderStatus(false);
        this.dialogRef.close();
        this._message.invoke('User details updated successfully.');
      } else {
        this._loader.emitLoaderStatus(false);
        this._message.invoke(result.response.params.errmsg);
      }
    }, (error: any) => {
      this._loader.emitLoaderStatus(false);
      this._message.invoke('Something went wrong. Please, try again.');
    })
  }

  readForm(req: any): Promise<any> {
    let request = {
    request: {
      type: req.type,
      subType: req.subType,
      action: req.action,
      framework: req.framework,
      rootOrgId: req.rootOrgId
    }
  };
    return this._forms.readForm(request)
    .toPromise()
  }

  openFormReadDialog(element: any) {
    this._loader.emitLoaderStatus(true);
    this.readForm(element).then(result => {
      if (result.statusCode == 200 && result.response.result.form !== undefined) {
        let formDetails = result.response.result.form;
        this._loader.emitLoaderStatus(false);
        this.dialogRef = this.dialog.open(this.formReadDialog, {
          data: { formLabel: 'Form Details', formData: { ...formDetails } }
        });
        this.dialogRef.afterClosed().subscribe((result: any) => {
        });
      } else {
        this._loader.emitLoaderStatus(false);
        this._message.invoke('Error fetching form details. Please, try again!');
      }
    }).catch(er => {
      this._loader.emitLoaderStatus(false);
      this._message.invoke('Error fetching form details. Please, try again!');
    })
  }
}