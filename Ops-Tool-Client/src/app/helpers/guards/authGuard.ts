import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const sessionExpiryTime = parseInt(localStorage.getItem('createdOn')||'{}') + (parseInt(localStorage.getItem('Expires')||'{}') * 1000);

        if (new Date().getTime() >= sessionExpiryTime) {
            // token is expired so logout and remove user data from storage
            localStorage.removeItem('key');
            localStorage.removeItem('createdOn');
            localStorage.removeItem('Expires');
            localStorage.removeItem('currentUser');
            window.location.replace('/logout');

            return false;
        }

        return true;
    }

}