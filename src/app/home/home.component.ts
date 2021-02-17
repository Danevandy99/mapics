import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { Post } from '../shared/models/post';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];

  constructor(
    private store: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.store.collectionGroup('posts', ref => ref.orderBy('timePosted', 'desc'))
      .get()
      .pipe(
        map(docs => {
          return docs.docs.map(doc => {
            return { ...<object>doc.data(), postId: doc.id } as Post;
          });
        })
      )
      .subscribe(posts => {
        this.posts = posts;
      })
  }
}
