import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class MessageService {
    constructor(private msg: MatSnackBar) {

    }

    invoke(message: any, action: any = '', config: any = { duration: 3000 }) {
        this.msg.open(message, action, config);
    }
}