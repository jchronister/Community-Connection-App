import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsListComponent } from './posts-list.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CommentsComponent } from './comments.component';
import { CreatePostComponent } from './create-post.component';

import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CreatePost } from './post-create-component';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    PostsListComponent, 
    CommentsComponent,
    CreatePost,
    CreatePostComponent
  ],


  imports: [
    CommonModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    RouterModule.forChild([
      { path: 'help-requests', component: PostsListComponent },
      { path: 'createrequest', component: CreatePost },
    ]),
  ],
  bootstrap: [PostsListComponent],
})
export class PostsModuleModule {}
