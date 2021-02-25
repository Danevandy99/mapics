import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { filter, map, switchMap } from 'rxjs/operators';
import { UserSettings } from 'src/app/shared/models/user';
import { AuthService } from '../../shared/service/auth.service';

@Component({
  selector: 'app-follow-popup',
  templateUrl: './follow-popup.component.html',
  styleUrls: ['./follow-popup.component.scss']
})
export class FollowPopupComponent implements OnInit {
  constructor(
    private store: AngularFirestore,
    private modalService: NgbModal,
    private authService: AuthService,
    private route: ActivatedRoute) { }

  @Input() userId: string;
  @Input() usersType: string;
  users: Array<UserSettings> = [];

  ngOnInit(): void {    
    this.route.params.subscribe(params => {
      this.getUsers();
    })
    console.log(this.userId);
  }
  ngOnDestroy(): void{
    this.modalService.dismissAll();
  }
  closeResult = '';

  getUsers(){
      this.store.collection('users').doc(this.userId).collection(this.usersType)
      .get()
      .pipe(
        map(docs => {
          return docs.docs.map( doc => {
            return { ...<Object>doc.data(), userId: doc.id } as UserSettings
          })
        })
      )
      .subscribe(users => {
        users.forEach(user => {
        this.store.collection('users').doc(user.userId)
        .get()
        .pipe( map
          (doc => {
            return { ...<object>doc.data(), userId: doc.id } as UserSettings;
          })
        )
        .subscribe(userSetting => {
          this.users.push(userSetting);
        })
      });
      });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
