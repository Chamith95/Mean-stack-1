import{ Post } from './post.model';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject}from 'rxjs';

@Injectable({providedIn:'root'})

export class PostsService{
    private posts:Post[]=[];
    private postUpdated=new Subject<Post[]>();

    constructor(private http:HttpClient){}
    getPosts(){
       this.http.get<{message:string,posts:Post[]}>('http://localhost:3000/api/posts')
       .subscribe((postData)=>{
          this.posts= postData.posts;
          this.postUpdated.next([...this.posts])

       });
    }

    getPostUpdateListner(){
        return this.postUpdated.asObservable(); 
    }

    addPost(post1:Post){
        const post:Post=post1;
        this.http.post<{message:string}>('http://localhost:3000/api/posts',post)
            .subscribe((responseData)=>{
                console.log(responseData.message);
                this.posts.push(post);
                this.postUpdated.next([...this.posts] );
            });

    }
}