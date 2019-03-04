import{ Post } from './post.model';
import { Injectable } from '@angular/core';
import {Subject}from 'rxjs';

@Injectable({providedIn:'root'})

export class PostsService{
    private posts:Post[]=[];
    private postUpdated=new Subject<Post[]>();
    getPosts(){
        return [...this.posts];
    }

    getPostUpdateListner(){
        return this.postUpdated.asObservable(); 
    }

    addPost(post1:Post){
        const post:Post=post1;
        this.posts.push(post);
        this.postUpdated.next([...this.posts] );
    }
}