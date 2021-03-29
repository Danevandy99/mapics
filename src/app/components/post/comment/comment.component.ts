import { Component, Input, OnInit, NgZone } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../shared/service/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { filter, first, map } from 'rxjs/operators';
import { Comment } from '../../../shared/models/comment';
import { Post } from 'src/app/shared/models/post';
import { UserSettings } from 'src/app/shared/models/user';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() post: Post;
  comments: Array<Comment>;

  closeResult = '';
  newComment = '';
  constructor(
    private modalService: NgbModal,
    private store: AngularFirestore,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.retreiveComments();
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title ', windowClass: 'comments' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async submitComment(commentText: string) {
    const user = await this.authService.user.pipe(filter(user => !!user), first()).toPromise();
    const comment: Partial<Comment> = {
      authorID: user.uid,
      postID: this.post.postId,
      commentText: commentText
    }
    const newDoc = await this.store.collection('users').doc(this.post.authorId).collection('posts').doc(this.post.postId).collection("comments").add(comment);
    comment.author = await this.store.collection('users').doc(user.uid)
    .get()
    .pipe( map
      (doc => {
        return { ...<object>doc.data(), userId: doc.id } as UserSettings;
      })
    )
    .toPromise();

    this.comments.unshift({
      ...comment,
      commentID: newDoc.id
    } as Comment);
    this.newComment = '';
  }

  retreiveComments() {
    this.store.collection('users').doc(this.post.authorId).collection('posts').doc(this.post.postId).collection("comments")
    .get()
    .pipe(
      map(docs => {
        return docs.docs.map( doc => {
          return { ...<Object>doc.data(), commentID: doc.id } as Comment
        })
      })
    )
    .subscribe(comments => {
      this.comments = comments;
      this.comments.forEach(comment => {
        this.store.collection('users').doc(comment.authorID)
        .get()
        .pipe( map
          (doc => {
            return { ...<object>doc.data(), userId: doc.id } as UserSettings;
          })
        )
        .subscribe(userSetting => {
          comment.author = userSetting;
        })
      });
    });

}
}

