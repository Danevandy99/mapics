import { Post } from 'src/app/shared/models/post';
import { Component, Input, OnInit } from '@angular/core';
import { Emoji, EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reaction',
  templateUrl: './reaction.component.html',
  styleUrls: ['./reaction.component.scss']
})
export class ReactionComponent implements OnInit {

  @Input() post: Post;

  closeResult = '';
  selectedReaction: EmojiData;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  react(data: { emoji: EmojiData, $event: MouseEvent }) {
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
