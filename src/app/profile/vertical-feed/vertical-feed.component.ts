import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Params } from '@angular/router';
import { map } from 'rxjs/operators';
import { Post } from 'src/app/shared/models/post';

@Component({
  selector: 'app-vertical-feed',
  templateUrl: './vertical-feed.component.html',
  styleUrls: ['./vertical-feed.component.scss']
})
export class VerticalFeedComponent implements OnInit {

  posts: Post[];

  constructor(
    private store: AngularFirestore,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe((params: Params) => {
      this.getUserPosts(params.id);
    });
  }

  getUserPosts(id: string) {
    this.store.collection('users').doc(id).collection('posts')
      .get()
      .pipe(
        map(docs => {
          return docs.docs.map(doc => {
            return { ...<object>doc.data(), postId: doc.id } as Post;
          });
        })
      )
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

}
