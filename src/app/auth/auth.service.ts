import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './signup/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated=false;
  private token:string;
  private userId:string;
  private TokenTimer:any;
  private authstatusListner=new Subject<boolean>()

  
  constructor(private http:HttpClient,private router:Router) { }

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  getAuthstatusListner(){
    return this.authstatusListner.asObservable();
  }

  createUser(email:string,password:string){
    const authData:AuthData={email:email,password:password};
    this.http.post("http://localhost:3000/api/user/signup",authData)
        .subscribe(response=>{
          console.log(response);
        }); 
  }

  login(email:string,password:string){
    const authData:AuthData={email:email,password:password};
    this.http.post<{token:string, expiresIn:number,userId:string}>("http://localhost:3000/api/user/login", authData)
        .subscribe(response=>{
          const token=response.token;
          this.token=token;
          if(token){
            const expiresInDuration=response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.userId=response.userId;
            this.isAuthenticated=true;
            this.authstatusListner.next(true);
            const now=new Date();
            const expirationDate=new Date(now.getTime()+expiresInDuration*1000);
            this.saveAuthData(token,expirationDate,this.userId);
            this.router.navigate(['/']); 
          }
        })
  }

  autoAuthuser(){
  const authInformation=this.getAuthData();
  if(!authInformation){
    return;
  }
  const now=new Date();
  const expiresin=authInformation.expirationDate.getTime() -now.getTime();
  if(expiresin>0){
    this.token=authInformation.token;
    this.isAuthenticated=true;
    this.userId=authInformation.userId;
    this.setAuthTimer(expiresin/1000)
    this.authstatusListner.next(true);
  }
  }

  private setAuthTimer(duration:number){
    console.log("Setting timer" +duration);
    this.TokenTimer=setTimeout(()=>{
      this.logout();
    },
    duration*1000
    )
  }

  logout(){
    this.token=null;
    this.isAuthenticated=false;
    this.authstatusListner.next(false);
    clearTimeout(this.TokenTimer);
    this.clearAuthData();
    this.userId=null;
    this.router.navigate(['/']);
   
  }

  private saveAuthData(token:string,expirationDate:Date,userId:string){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
    localStorage.setItem("userId",userId)
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId")
  }

  private getAuthData(){
    const token=localStorage.getItem("token");
    const expirationDate=localStorage.getItem("expiration");
    const userId=localStorage.getItem("userId");
    if(!token || !expirationDate){
      return;
    }
    return{
      token:token,
      expirationDate:new Date(expirationDate),
      userId:userId
    }
  }

}
