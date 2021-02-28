import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Post } from 'src/app/shared/models/post';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile-highlights',
  templateUrl: './profile-highlights.component.html',
  styleUrls: ['./profile-highlights.component.scss']
})
export class ProfileHighlightsComponent implements OnInit {

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
