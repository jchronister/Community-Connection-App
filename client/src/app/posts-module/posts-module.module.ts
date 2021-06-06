import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsListComponent } from './posts-list.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CommentsComponent } from './comments.component';

import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CreatePostComponent } from './create-post.component';

@NgModule({
  declarations: [PostsListComponent, CommentsComponent, CreatePostComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'help-requests', component: PostsListComponent },
    ]),
  ],
  bootstrap: [PostsListComponent],
})
export class PostsModuleModule {}
