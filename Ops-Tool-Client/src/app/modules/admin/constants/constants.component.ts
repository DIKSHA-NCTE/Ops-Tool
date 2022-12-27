import { AfterViewInit, Component, ViewChild, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConstantsService } from '../../../helpers/services/admin/constants/constants.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { validateUniqueConstantComb } from '../../../helpers/directives/custom-validator.service';
import { MessageService } from 'src/app/helpers/services/core/message.service';

export interface Constant {
  id: string;
  name: string;
  value: string
}

@Component({
  selector: 'app-constants',
  templateUrl: './constants.component.html',
  styleUrls: ['./constants.component.scss']
})
export class ConstantsComponent implements AfterViewInit {

  consFields: any = [];
  displayedColumns: string[] = ['name', 'value', 'action'];
  dataSource: MatTableDataSource<Constant>;
  dialogRef: any;
  showFieldName: boolean = true;
  addForm: FormGroup;
  fieldName: any;
  fieldValue: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('addConstantTemplate') addConstantDialog!: TemplateRef<any>;
  @ViewChild('deleteConstantTemplate') deleteConstantDialog!: TemplateRef<any>;

  constructor(private _constantService: ConstantsService, public message: MessageService, private _fb: FormBuilder, public dialog: MatDialog) {
    this.getAllConfFields();
    this.dataSource = new MatTableDataSource();

    this.fieldName = new FormControl('', [Validators.required, Validators.max(40)]);
    this.fieldValue = new FormControl('', [Validators.required, Validators.max(50)]);
    this.addForm = this._fb.group({
      field_name: this.fieldName,
      field_value: this.fieldValue
    }, { validator: validateUniqueConstantComb(this.dataSource) })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllConfFields(action: any = 'list') {
    this._constantService.getConstantsData().subscribe((response: any) => {
      if (response.result && response.result.length > 0) {
        const data = response.result;
        const temp = new Set();

        const arrData: any[] = [];
        data.forEach((cons: any) => {
          /* Get cons values */
          const rows = cons.fvalues.split(',');
          rows.forEach((item: any) => {
            const values = item.split('||');
            arrData.push({ id: values[0], name: cons.field, value: values[1] });
          });
          //

          temp.add(cons.field);
        });

        this.dataSource.data = arrData;
        this.consFields = Array.from(temp);
      }

      if (action == 'list') {
        // this._comm.emitLoaderStatus(true);
        this.message.invoke('Constants list fetched successfully.');
      }
    }, (err) => {
      // if (action == 'list') {
      // this._comm.emitLoaderStatus(true);
      this.message.invoke('Error fetching constants list.');
      // }
    });
  }

  openDialog1() {
    this.dialogRef = this.dialog.open(this.addConstantDialog, {
    });
  }

  openDialog2(obj: any) {
    this.dialogRef = this.dialog.open(this.deleteConstantDialog, {
      data: { 'id': obj.id, 'fieldName': obj.name, 'fieldValue': obj.value },
    });
  }

  addNewConstant(event: any) {
    if (this.addForm.invalid) {
      return;
    }

    const fieldName = (typeof this.addForm.value.field_name == 'object') ? (
      this.addForm.value.field_name.length ? this.addForm.value.field_name[0] : ''
    ) : (this.addForm.value.field_name || '');

    // this._comm.emitLoaderStatus(false);

    const temp = {
      fieldName,
      fieldValue: this.addForm.value.field_value,
    };

    this._constantService.addConstantsData(temp).subscribe(
      (resp: any) => {
        if (resp.statusCode === 200 && resp.responseCode == 'OK') {
          this.getAllConfFields('add');
          this.message.invoke('Constant added successfully.');
        } else {
          this.message.invoke('Error adding constant.');
        }

        // this._comm.emitLoaderStatus(true);
      },
      (err) => {
        // this._comm.emitLoaderStatus(true);
        this.message.invoke('Error adding constant.');
      });

    this.addForm.reset();
    this.dialogRef.close();
  }

  deleteConstant(id: number) {
    if (!id) {
      this.message.invoke('Invalid configuration selected for deletion.');
      return;
    }

    // this._comm.emitLoaderStatus(false);
    this._constantService.deleteConstantsData(id).subscribe(
      (resp: any) => {
        if (resp.statusCode === 200 && resp.responseCode == 'OK') {
          this.getAllConfFields('delete');
          this.message.invoke('Constant deleted successfully.');
        } else {
          this.message.invoke('Error deleting constant.');
        }

        // this._comm.emitLoaderStatus(true);
      },
      (err) => {
        // this._comm.emitLoaderStatus(true);
        this.message.invoke('Error deleting constant.');
      });

    this.dialogRef.close();
  }

  showCustomNameField(field: boolean) {
    this.showFieldName = field;
    this.addForm.get('field_name')?.reset();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
