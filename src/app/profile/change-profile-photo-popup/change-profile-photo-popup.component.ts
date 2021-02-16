import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../shared/service/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-change-profile-photo-popup',
  templateUrl: './change-profile-photo-popup.component.html',
  styleUrls: ['./change-profile-photo-popup.component.scss']
})
export class ChangeProfilePhotoPopupComponent implements OnInit {

  @Input() photoSelected: string;

  userID;
  newPhoto = "https://www.jamiemaison.com/creating-a-simple-text-editor/placeholder.png";
  currentPhoto;
  closeResult: String;

  constructor(
      private modalService: NgbModal, 
      private afStorage: AngularFireStorage,
      private authService: AuthService,
      private store: AngularFirestore) { }

  ngOnInit(): void {
    this.authService.user.pipe(filter(user => !!user)).subscribe(user => { 
      this.userID = user.uid;
    });
    // this.currentPhoto = this.afStorage.ref("users/"+this.userID+"/photos/profilePhotos/"+this.photoSelected);
    // this.afStorage.ref("users/"+this.userID+"/photos/profilePhotos/"+this.photoSelected).putString().getDownloadURL().subscribe(photo => {
    //   console.log(photo);
    // });
    // console.log();
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
    } 
    else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } 
    else {
      return `with: ${reason}`;
    }
  }

  upload(event) {     
    this.afStorage.upload("users/"+this.userID+"/photos/profilePhotos/"+this.photoSelected, event.target.files[0]);  
  }
}
