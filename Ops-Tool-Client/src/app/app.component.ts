import {Component, OnInit} from '@angular/core';
import {SupportUsersServiceService} from './helpers/services/support-users/support-users-service.service';
import { Router } from '@angular/router';
import { ToasterService } from './helpers/utils/toaster.service';
import { Toast } from './helpers/interfaces/toaster.interface';
import { LoaderService } from './helpers/utils/loader.service';

 @Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  validUser: boolean = false;
  showLoader: boolean | undefined;
  public msgs: Toast[] = [];
  constructor( private router: Router,private _supportUser: SupportUsersServiceService, private _toaster: ToasterService, private _loader: LoaderService){
    
   }

  ngOnInit():void{
    this.validatePermissionForUser();
  }

  ngAfterContentInit(): void{
    this._loader.loaderStatusEmitted$.subscribe(response=> {
      if(response == false){
        setTimeout(() => {
          this.showLoader = response;
        }, 1000);
      }else{
        setTimeout(() => {
          this.showLoader = response;
        }, 0);
      }
    })
  }

  validatePermissionForUser() {
    // tslint:disable-next-line: comment-format

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser !== null) {
      this.validUser = true;
    } else {
      const a = document.cookie;
      let uid = '';
      // tslint:disable-next-line: no-debugger
      const cookiearray = a.split(';');
      for (let i = 0; i < cookiearray.length; i++) {
        if (cookiearray[i].split('=')[0].trim() === 'uid') {
          uid = cookiearray[i].split('=')[1];
        }
      }

      if (typeof uid !== 'undefined' && uid !== null && uid !== '') {
        this._supportUser.fetchUserPermission({
          userId: uid
        }).subscribe((resp: any) => {
          if (resp.responseCode === 201) {
            this.validUser = false;
              this.logout();
          } else {
            localStorage.setItem('currentUser', JSON.stringify(resp.result));
            this.validUser = true;
          }
        });
      }
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    window.location.replace('/logout');
    this.router.navigate(['/content']);
  }
}