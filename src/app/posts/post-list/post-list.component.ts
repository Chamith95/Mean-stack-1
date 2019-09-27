import { Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import{ Post } from '../post.model';
import{ PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { LiqourService } from 'src/app/liqour/liqour.service';
import { Liqour } from 'src/app/liqour/liqour.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {
  // posts=[
  //   {title:'First Post',content:'This is the first post\'s content'},
  //   {title:'Second Post',content:'This is the Second post\'s content'},
  //   {title:'Third Post',content:'This is the Third post\'s content'},
  // ]

  posts:Post[]=[];
  liqour:Liqour[]=[];
  public userisauthenticated:boolean=false;
  private postsSub:Subscription;
  private liqourSub:Subscription;
  private authstatussubs:Subscription; 
  userId:string;
  isLoading=false;
  totalPosts=0;
  totalliqours=0;
  postsPerPage=2;
  currentPage=1;
  pageSizeOptions=[1,2,5,10];
  SearchForm: any;

 

  constructor(public postsService:PostsService,private authservice:AuthService,private liqourService:LiqourService) { }

  ngOnInit() {
    this.isLoading=true;
    this.postsService.getPosts(this.postsPerPage,this.currentPage,this.SearchForm);
    this.userId=this.authservice.getUserId();
    this.postsSub=this.postsService.getPostUpdateListner()
      .subscribe((postData:{posts:Post[],postCount:number})=>{
        this.isLoading=false;
        this.totalPosts=postData.postCount; 
        this.posts=postData.posts;

        
    });
    this.userisauthenticated=this.authservice.getIsAuth();
    this.authstatussubs=this.authservice.getAuthstatusListner().
      subscribe(isAutrhenticated=>{
        this.userisauthenticated=isAutrhenticated;
        this.userId=this.authservice.getUserId();
      } );

      this.liqourService.getliqour(this.postsPerPage,this.currentPage,this.SearchForm);
      this.liqourSub=this.liqourService.getLiqourUpdateListner()
      .subscribe((liqourData:{liqour:Liqour[],liqourCount:number})=>{
        this.isLoading=false;
        this.totalliqours=liqourData.liqourCount; 
        this.liqour=liqourData.liqour; 
        console.log(this.liqour)       
    });
  
   
      
      
  }

  Search(){
    this.postsService.getPosts(this.postsPerPage,this.currentPage,this.SearchForm);
  }

  onChangedPage(pageData:PageEvent){
    this.isLoading=true;
    this.currentPage=pageData.pageIndex+1;
    this.postsPerPage =pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage,this.currentPage,this.SearchForm);
  }

  onDelete(postId:string){
    this.isLoading=true;
      this.postsService.deletePost(postId).subscribe(()=>{
        this.postsService.getPosts(this.postsPerPage,this.currentPage,this.SearchForm);
      });
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authstatussubs.unsubscribe();
  }

}
