import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubmodulesService } from 'src/app/helpers/services/submodules/submodules.service';
import { LoaderService } from 'src/app/helpers/utils/loader.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  modules: any = [];
  moduleId: any;
  adminSubModules: any = [];
  subModules: any = [];
  constructor(private _submodules: SubmodulesService, private _loader: LoaderService, private ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this._loader.emitLoaderStatus(true);
    this.ActivatedRoute.queryParams
      .subscribe(params => {
        this.moduleId = params.id;
      });
    this.getSubmodulesData(this.moduleId);
  }

  getSubmodulesData = (id: any) => {
    let request = {
      request: {
        body: {
          id: id
        },
      },
    };
    this._submodules
      .getSubmodulesData(request)
      .subscribe((res: any) => {
        if (res.status === 200 && res.responseCode === 'OK') {
          if ( res.adminSubModules && res.adminSubModules.length > 0 ) { this.adminSubModules = res.adminSubModules; }
          if (res.subModules && res.subModules.length > 0) { this.subModules = res.subModules; }
          this.modules = this.adminSubModules.concat(this.subModules);
          this._loader.emitLoaderStatus(false);
        }
      }, (error: any) => {
      });
  }
}
