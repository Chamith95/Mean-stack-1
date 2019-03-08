import { Component, OnInit} from '@angular/core'; 
import {NgForm} from '@angular/forms'

import{ Post } from '../post.model';
import{ PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls:['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
    enteredTitle='';
    enteredContent='';
    isLoading=false;
    private mode ='create'
    private postId:string;
    post:Post;


    constructor(public postsService:PostsService,public route:ActivatedRoute){

    }

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap: ParamMap)=>{
            if(paramMap.has('postId')){
                this.mode='edit';
                this.postId=paramMap.get('postId');
                this.isLoading=true;
                this.postsService.getPost(this.postId).subscribe(PostData =>{
                    this.isLoading=false;
                    this.post ={id:PostData._id,title:PostData.title,content:PostData.content}
                }); 
            }else{
                this.mode='create';
                this.postId=null;
            }
        });
    }
    OnSavePost(form:NgForm){
        if(form.invalid){
            return;
        }
        this.isLoading=true;
        if(this.mode==="create"){
            const post:Post={
                id:null,
                title:form.value.title,
                content:form.value.content
                
            };
            this.postsService.addPost(post);
        }
        else{
            const post:Post={
                id:this.postId,
                title:form.value.title,
                content:form.value.content
                
            };
            this.postsService.updatePost(this.postId,post);
        }
   
        form.resetForm(); 

}
}