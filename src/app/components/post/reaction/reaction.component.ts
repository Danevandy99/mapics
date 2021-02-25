import { AngularFirestore } from '@angular/fire/firestore';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { AuthService } from './../../../shared/service/auth.service';
import { Post } from 'src/app/shared/models/post';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Emoji, EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Reaction } from 'src/app/shared/models/reaction';

@Component({
  selector: 'app-reaction',
  templateUrl: './reaction.component.html',
  styleUrls: ['./reaction.component.scss']
})
export class ReactionComponent implements OnInit {

  @Input() post: Post;

  closeResult = '';
  selectedReaction: EmojiData;
  submittedReaction: Reaction;

  constructor(private modalService: NgbModal, private authService: AuthService, private store: AngularFirestore) { }

  ngOnInit(): void {
    this.getSelectedReaction();
  }

  getSelectedReaction() {
    this.authService.user
      .pipe(
        filter(user => !!user),
        switchMap(user => {
          return this.store.collection('users').doc(this.post.authorId).collection('posts').doc(this.post.postId).collection('reactions').doc(user.uid).get()
        }),
        map(document => {
          return { ...<object>document.data(), userId: document.id } as Reaction
        })
      )
      .subscribe(reaction => {
        this.submittedReaction = reaction;
      });
  }

  getBackgroundImage() {
    return "/assets/images/64.png";
  }

  async react(modal) {
    this.submittedReaction.emoji = this.selectedReaction;
    this.selectedReaction = null;
    const currentUserId = await this.authService.user.pipe(filter(user => !!user), first()).toPromise();
    this.store.collection('users').doc(this.post.authorId).collection('posts').doc(this.post.postId).collection('reactions').doc(currentUserId.uid).set({
      emoji: this.submittedReaction.emoji
    });
    modal.close('Save Click');
  }

  selectReaction(data: { emoji: EmojiData, $event: MouseEvent }) {
    this.selectedReaction = data.emoji;
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title ', windowClass: 'reactions' }).result.then((result) => {
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
}
