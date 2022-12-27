import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NTPTOOL } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  constructor(private http: HttpClient) { }

  public getModulesList() {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.ADMIN + NTPTOOL.API.MODULE_LIST);
  }

  public addNewModule(req: any) {
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.ADMIN + NTPTOOL.API.MODULE_CREATE, req);
  }

  public updateModule(req: any) {
    return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.ADMIN + NTPTOOL.API.MODULE_UPDATE, req);
  }

  public deleteModule(id: number) {
    return this.http.delete(environment.LOCALHOST + NTPTOOL.SUB.ADMIN + NTPTOOL.API.MODULE_DELETE + '/' + id);
  }

  public getModule(id: number) {
    return this.http.get(environment.LOCALHOST + NTPTOOL.SUB.ADMIN + NTPTOOL.API.MODULE_GET + '/' + id);
  }

  // public getSubModules(req: any) {
  //   return this.http.post(environment.LOCALHOST + NTPTOOL.SUB.ADMIN + NTPTOOL.API.SUB, req);
  // }
}
