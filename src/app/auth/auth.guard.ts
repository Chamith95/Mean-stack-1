import { CanActivate } from '@angular/router/src/utils/preactivation';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate{
    path: ActivatedRouteSnapshot[];
    route: ActivatedRouteSnapshot;


    constructor(private authservice:AuthService,private router:Router){
      
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state:RouterStateSnapshot
    ):boolean |Observable<boolean> |Promise<boolean>{
        const isAuth=this.authservice.getIsAuth();
        if(!isAuth){
            this.router.navigate(['/login']);
        }
        return isAuth;
    }

    
}