import { Component, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModulesService } from 'src/app/helpers/services/admin/modules/modules.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'src/app/helpers/services/core/message.service';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';

export interface Module {
  name: string
  description: string
  url: string
  isRootModule: string
  isAdminModule: string
  isVisible: string
  roles: string
  rootModule: string
  // icon: string
}

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements AfterViewInit {

  defaultRoles: string[] = ["SUPPORT ADMIN", "SUPPORT CRUD", "SUPPORT READ"];
  rootModules: any = [];
  displayedColumns: string[] = ['name', 'description', 'url', 'isRootModule', 'isAdminModule', 'isVisible', 'roles', 'rootModule', 'action'];
  dataSource: MatTableDataSource<Module>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dialogRef: any;
  @ViewChild('addUpdateModuleTemplate') addUpdateModuleDialog!: TemplateRef<any>;
  @ViewChild('deleteModuleTemplate') deleteModuleDialog!: TemplateRef<any>;

  name: any;
  desc: any;
  url: any;
  isAdminModule: any;
  isRootModule: any;
  isVisible: any;
  roles: any;
  rootModule: any;
  addUpdateForm: FormGroup;

  constructor(private _moduleService: ModulesService, public message: MessageService, public dialog: MatDialog, private _fb: FormBuilder) {
    this.getAllModules();
    this.dataSource = new MatTableDataSource();

    this.name = new FormControl('', [Validators.required, Validators.max(40)]);
    this.desc = new FormControl('');
    this.url = new FormControl('', [Validators.required]);
    this.isAdminModule = new FormControl(true);
    this.isRootModule = new FormControl(true);
    this.isVisible = new FormControl(true);
    this.roles = new FormControl([], [Validators.required]);
    this.rootModule = new FormControl('');
    this.addUpdateForm = this._fb.group({
      name: this.name,
      desc: this.desc,
      url: this.url,
      isAdminModule: this.isAdminModule,
      isRootModule: this.isRootModule,
      isVisible: this.isVisible,
      roles: this.roles,
      rootModule: this.rootModule,
    });

    this.addUpdateForm.controls['isRootModule'].valueChanges.subscribe(val => {
      if (!val) {
        this.addUpdateForm.controls['rootModule'].setValidators([Validators.required]);
      } else {
        this.addUpdateForm.controls['rootModule'].clearValidators();
      }
      this.addUpdateForm.controls['rootModule'].updateValueAndValidity();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog1() {
    this.dialogRef = this.dialog.open(this.addUpdateModuleDialog, {
      data: { formLabel: 'Add Module' }
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      this.addUpdateForm.reset();
      this.addUpdateForm.controls['isAdminModule'].setValue(true);
      this.addUpdateForm.controls['isRootModule'].setValue(true);
      this.addUpdateForm.controls['isVisible'].setValue(true);
    });
  }

  openDialog2(obj: any) {
    this.addUpdateForm.controls['rootModule'].setValue(obj.rootmoduleid);
    this.dialogRef = this.dialog.open(this.addUpdateModuleDialog, {
      data: { formLabel: 'Update Module', ...obj, roles: obj.roles.split(',') }
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      this.addUpdateForm.reset();
      this.addUpdateForm.controls['isAdminModule'].setValue(true);
      this.addUpdateForm.controls['isRootModule'].setValue(true);
      this.addUpdateForm.controls['isVisible'].setValue(true);
    });
  }

  openDialog3(obj: any) {
    this.dialogRef = this.dialog.open(this.deleteModuleDialog, {
      data: { 'id': obj.id, 'name': obj.name },
    });
  }

  getAllModules(action: any = 'list') {
    this._moduleService.getModulesList().subscribe((response: any) => {
      if (response.result && response.result.length > 0) {
        const data = response.result;
        this.dataSource.data = data;
        this.rootModules = data.map((item: any) => {
          if (item.isRootModule) {
            return { id: item.id, name: item.name }
          }
          return false;
        });

        if (action == 'list') {
          // this._comm.emitLoaderStatus(true);
          this.message.invoke('Modules list fetched successfully.');
        }
      }
    }, (err) => {
      //if (action == 'list') {
      // this._comm.emitLoaderStatus(true);
      this.message.invoke('Error fetching modules list.');
      //}
    });
  }

  OnSubmit(event: any, id: number) {
    const reqBody = {
      name: this.addUpdateForm.value.name,
      description: this.addUpdateForm.value.desc || null,
      url: this.addUpdateForm.value.url,
      roles: this.addUpdateForm.value.roles.length ? this.addUpdateForm.value.roles.join(',') : '',
      isAdminModule: this.addUpdateForm.value.isAdminModule,
      isVisible: this.addUpdateForm.value.isVisible,
      isRootModule: this.addUpdateForm.value.isRootModule,
      rootModuleId: this.addUpdateForm.value.rootModule || null,
      icon: null
    };

    let $observable;
    let successMsg = '';
    let errorMsg = '';
    if (id) {
      $observable = this._moduleService.updateModule({ id, ...reqBody });
      successMsg = 'Module updated successfully.';
      errorMsg = 'Error updating module.';
    } else {
      $observable = this._moduleService.addNewModule(reqBody);
      successMsg = 'Module added successfully.';
      errorMsg = 'Error adding new module.';
    }

    $observable.subscribe(
      (resp: any) => {
        if (resp.statusCode === 200 && resp.responseCode == 'OK') {
          this.getAllModules('addUpdate');
          this.message.invoke(successMsg);
        } else {
          this.message.invoke(errorMsg);
        }
        // this._comm.emitLoaderStatus(true);
      }, (err) => {
        // this._comm.emitLoaderStatus(true);
        this.message.invoke(errorMsg);
      });

    this.dialogRef.close();
  }

  moduleDelete(id: number) {
    if (!id) {
      this.message.invoke('Selected module doesn\'t exists.');
      return;
    }

    // this._comm.emitLoaderStatus(false);
    this._moduleService.deleteModule(id).subscribe(
      (resp: any) => {
        if (resp.statusCode === 200 && resp.responseCode == 'OK') {
          this.getAllModules('delete');
          this.message.invoke('Module deleting successfully.');
        } else {
          this.message.invoke('Error deleting module.');
        }
        // this._comm.emitLoaderStatus(true);
      }, (err) => {
        // this._comm.emitLoaderStatus(true);
        this.message.invoke('Error deleting module.');
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
