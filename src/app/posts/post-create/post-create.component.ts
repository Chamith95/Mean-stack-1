import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {mimeType} from "./mime-type.validator";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
    enteredTitle = '';
    enteredContent = '';
    isLoading = false;
    private mode = 'create'
    private postId: string;
    post: Post;
    form: FormGroup;
    imagepreview:string;


    constructor(public postsService: PostsService, public route: ActivatedRoute) {

    }

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)]}),
            content: new FormControl(null, { validators: [Validators.required] }),
            image:new FormControl(null,{validators:[Validators.required],asyncValidators:[mimeType]})
        })
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.postsService.getPost(this.postId).subscribe(PostData => {
                    this.isLoading = false;
                    console.log(PostData.imagePath);
                    this.post = {
                        id: PostData._id,
                        title: PostData.title,
                        content: PostData.content,
                        imagePath:PostData.imagePath 
                        };
                        console.log(this.post.title);
             
                this.form.setValue({
                    title:this.post.title,
                    content: this.post.content,
                     image:this.post.imagePath
                
                }
                );
                });
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onImagepicked(event:Event){
        const file=(event.target as HTMLInputElement).files[0];
        this.form.patchValue({image:file});
        this.form.get('image').updateValueAndValidity();
        console.log(file);
        console.log(this.form); 
        const reader=new FileReader();
        reader.onload = () =>{
            this.imagepreview=reader.result as string;
            console.log(this.imagepreview);
        };
        reader.readAsDataURL(file)
    }

    OnSavePost() {
        if (this.form.invalid) {
            return;
        }
        this.isLoading = true;
        if (this.mode === "create") {
            const post: Post = {
                id: null,
                title:this.form.value.title,
                content:this.form.value.content,
                imagePath:null

            };
            this.postsService.addPost(
                this.form.value.title,
                this.form.value.content,
                this.form.value.image);
        }
        else {
           this.postsService.updatePost(
                this.postId,
                this.form.value.title,
                this.form.value.content,
                this.form.value.image);
        }

   this.form.reset();
    }
}