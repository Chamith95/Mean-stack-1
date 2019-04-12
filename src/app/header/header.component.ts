import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  private authListnerSubs: Subscription;
  userisAuthenticated=false;

  constructor(private authservice:AuthService) { }

  ngOnInit() {
    this.userisAuthenticated=this.authservice.getIsAuth();
    this.authListnerSubs=this.authservice.getAuthstatusListner().subscribe(isAuthenticated =>{
      this.userisAuthenticated=isAuthenticated;
    })
  }

  onLogout(){
    this.authservice.logout(); 
  }

  ngOnDestroy(){
    this.authListnerSubs.unsubscribe();
  }

}
