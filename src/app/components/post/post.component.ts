import { UserSettings } from './../../shared/models/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/shared/models/post';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: Post;

  blankImage: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

  constructor(
    private store: AngularFirestore
  ) { }

  ngOnInit(): void {
    if (!this.post.author) this.getPostAuthor();
  }

  getPostAuthor() {
    this.store.collection('users').doc(this.post.authorId)
      .get()
      .pipe(
        map(doc => {
          return { ...<object>doc.data(), userId: doc.id } as UserSettings;
        })
      )
      .subscribe(user => {
        this.post.author = user;
      });
  }
}
