import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TokensComponent } from '../tokens/tokens.component';
import { Router } from '@angular/router';
import { ToasterService } from '../../../../helpers/utils/toaster.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  public user: any;
  constructor(public dialog: MatDialog,
    private router: Router,
    private _toaster: ToasterService) { }

  ngOnInit(): void {
    setTimeout(() => {
      let currentUser: any = localStorage.getItem("currentUser");
    if (JSON.parse(currentUser)?.length > 0) {
      (JSON.parse(currentUser)[0].lastName !== "" && JSON.parse(currentUser)[0].lastName !== null) ?
        this.user = `${JSON.parse(currentUser)[0].firstName} ${JSON.parse(currentUser)[0].lastName}` :
        this.user = `${JSON.parse(currentUser)[0].firstName}`
    }
    }, 1000);
  }

  logout() {
    this._toaster.emitChange({ type: 'success', title: 'Logging out...', body: 'Kindly re-login to access the system.', delay: 5000 });
    setTimeout(() => {
      localStorage.removeItem('currentUser')
      window.location.replace('/logout');
      this.router.navigate(['/dashboard']);
    }, 3000);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TokensComponent, {
      position: { bottom: '15px' },
      minWidth: '95%',
      height: 'auto',
      minHeight: '300px',
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}


@Component({
  selector: 'token-dialog',
  templateUrl: 'tokens.component.html',
})
export class DialogContentExampleDialog { }
