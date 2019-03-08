import{ Post } from './post.model';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject}from 'rxjs';
import {map }from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn:'root'})

export class PostsService{
    private posts:Post[]=[];
    private postUpdated=new Subject<Post[]>();

    constructor(private http:HttpClient,private router:Router){}
    getPosts(){
       this.http
       .get<{message:string,posts:any}>(
           "http://localhost:3000/api/posts"
           )
       .pipe(map((postData)=>{
            return postData.posts.map(post=>{
                return{
                    title: post.title,
                    content: post.content,
                    id: post._id
                }
            })
       }))
       .subscribe((transformedPosts)=>{
          this.posts= transformedPosts;
          this.postUpdated.next([...this.posts])

       });
    }

    getPostUpdateListner(){
        return this.postUpdated.asObservable(); 
    }

    addPost(post1:Post){
        const post:Post=post1;
        this.http.post<{message:string,postId:string}>('http://localhost:3000/api/posts',post)
            .subscribe((responseData)=>{
                const Id =responseData.postId;
                post.id=Id;
                this.posts.push(post);
                this.postUpdated.next([...this.posts] );
                this.router.navigate(["/"])
            });

    }

    getPost(id:string){
        return this.http.get<{_id:string,title:string,content:string}>("http://localhost:3000/api/posts/" +id)
    }
    
    updatePost(id:string,post1:Post){
         const post: Post =post1;
         this.http.put("http://localhost:3000/api/posts/" +id,post)
         .subscribe(response=>{
             const updatedPosts=[...this.posts];
             const oldPostIndex =updatedPosts.findIndex(p =>p.id ===post.id)
             updatedPosts[oldPostIndex]=post;
             this.posts =updatedPosts;
             this.postUpdated.next([...this.posts]);
             this.router.navigate(["/"])
          } );
    }

    deletePost(postId:string){
        this.http.delete("http://localhost:3000/api/posts/" +postId)
            .subscribe(()=>{
                const updatedPosts =this.posts.filter(post => post.id!==postId)
                this.posts=updatedPosts;
                this.postUpdated.next([...this.posts]);
            });
    }
}