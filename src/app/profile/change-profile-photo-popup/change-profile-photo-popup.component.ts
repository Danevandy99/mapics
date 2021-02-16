import { UserSettings } from './../../shared/models/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../shared/service/auth.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { filter, finalize, map, tap, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-change-profile-photo-popup',
  templateUrl: './change-profile-photo-popup.component.html',
  styleUrls: ['./change-profile-photo-popup.component.scss']
})
export class ChangeProfilePhotoPopupComponent implements OnInit {

  @Input() photoSelected: string;
  @Output() refreshUserSettings: EventEmitter<any> = new EventEmitter();

  uploading: boolean = false;
  file: File;
  fileUrl: string = 'https://www.jamiemaison.com/creating-a-simple-text-editor/placeholder.png';
  userID;
  userSettings: UserSettings;
  currentPhoto = 'https://www.jamiemaison.com/creating-a-simple-text-editor/placeholder.png';
  closeResult: String;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  constructor(
    private modalService: NgbModal,
    private afStorage: AngularFireStorage,
    private authService: AuthService,
    private store: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.authService.user
    .pipe(
      filter(user => !!user),
      tap(user => {
        this.userID = user.uid;
      }),
      switchMap(user => this.store.collection('users').doc(user.uid).get()),
      map(document => {
        return { ...<object>document.data(), userId: document.id } as UserSettings;
      })
    ).subscribe((userSettings: UserSettings) => {
      this.userSettings = userSettings;
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.cleanUpAndReset();
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

  async upload(event) {
    console.log(event);
    this.file = event.target.files[0];

    const fileReader = new FileReader();
    fileReader.addEventListener('load', (event) => {
      this.fileUrl = event.target.result as string;
    });
    fileReader.readAsDataURL(this.file);
  }

  async savePhoto(content: NgbActiveModal) {
    this.uploading = true;
    if (!this.file) return;
    var filePath = "users/" + this.userID + "/photos/profilePhotos/" + this.photoSelected;
    var fileRef = this.afStorage.ref(filePath)
    var task = this.afStorage.upload(filePath, this.file);
    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL()
          .subscribe((url: string) => {
            const updateObject = (this.photoSelected === 'profile-photo') ? { photoURL: url } : { coverPhotoURL: url };
            this.userSettings = {
              ...this.userSettings,
              ...updateObject
            }
            this.store.collection('users').doc(this.userID).update(updateObject);
            this.cleanUpAndReset();
            this.refreshUserSettings.emit(null);
            this.uploading = false;
            content.close();
          });
        })
     )
    .subscribe()
  }

  cleanUpAndReset() {
    this.file = null;
    this.downloadURL = null;
    this.fileUrl = 'https://www.jamiemaison.com/creating-a-simple-text-editor/placeholder.png';
  }
}
