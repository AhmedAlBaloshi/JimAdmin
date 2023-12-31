import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApisService } from '../services/apis.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authServ: ApisService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): any {
        ///// Less Secure but faster
        const uid = localStorage.getItem('uid');
        const status = localStorage.getItem('status');
        if (uid && uid != null && uid !== 'null' && status && status != null && status !== 'null') {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}
