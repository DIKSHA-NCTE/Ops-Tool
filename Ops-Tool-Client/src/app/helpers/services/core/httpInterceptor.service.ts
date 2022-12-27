import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';
import { Observable, throwError } from 'rxjs';
import { User } from "../../interfaces/user.interface";
import { catchError, map } from "rxjs/operators";
import { MessageService } from './message.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/helpers/utils/loader.service';

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {

    constructor(private _message: MessageService, private _router: Router, private _loader: LoaderService) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // console.log("Passed through the interceptor in request");
        let currentUser: User[] = [];
        currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.length > 0) {
            request = request.clone({
                setHeaders: {
                    contentType: 'application/json',
                    userId: currentUser[0]['userId'],
                    userName: currentUser[0]['userName']
                }
            });
        }
        return next.handle(request)
            .pipe(
                map(res => {
                    // console.log("Passed through the interceptor in response");
                    return res
                }),
                catchError((error: HttpErrorResponse) => {
                    let errorMsg = '';
                    if (error.error instanceof ErrorEvent) {
                        // console.log('This is client side error');
                        errorMsg = `Error: ${error.error.message}`;
                    } else {
                        // console.log('This is server side error');
                        if (error.status == 500) {
                            this._message.invoke(`${error.error.error}! ${error.error.message}`);
                            this.logout();
                        } else {
                            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
                            this._loader.emitLoaderStatus(false);
                            this._message.invoke(`${this.getServerErrorMessage(error)}`);
                        }
                    }
                    return throwError(errorMsg);
                })
            )
    }

    logout() {
        setTimeout(() => {
            localStorage.removeItem('currentUser')
            window.location.replace('/logout');
            this._router.navigate(['/dashboard']);
        }, 3000);
    }

    private getServerErrorMessage(error: HttpErrorResponse): string {
        switch (error.status) {
            case 404: {
                return `Not Found: ${error.error.message}`;
            }
            case 403: {
                return `Access Denied: ${error.error.message}`;
            }
            case 401: {
                return `Session Expired. ${error.error.message}`;
            }
            default: {
                return `Unknown Server Error: ${error.error.message}`;
            }

        }
    }
}