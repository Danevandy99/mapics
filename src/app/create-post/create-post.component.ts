import { LocationService } from './../shared/service/location.service';
import { Router } from '@angular/router';
import { AuthService } from './../shared/service/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';
import { Post } from '../shared/models/post';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase';
import geohash from "ngeohash";
import { Location } from '@angular/common';

enum CreatePostState {
  CAMERA = 0,
  PREVIEW = 1
}

enum CreatePostButtonState {
  UNSAVED = 0,
  SAVING = 1,
  SAVED_SUCCESSFULLY = 2,
  NOT_SAVED_SUCCESSFULLY = 3
}

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  public createPostButtonState = CreatePostButtonState.UNSAVED;
  public CreatePostButtonState = CreatePostButtonState;
  public CreatePostState = CreatePostState;
  public createPostState: CreatePostState = CreatePostState.CAMERA;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public newPostForm: FormGroup = new FormGroup({
    caption: new FormControl('', [Validators.required, Validators.maxLength(200)])
  });
  public createPostFirebaseError: string;

  // latest snapshot
  public webcamImage: WebcamImage = null;

  public errors: WebcamInitError[] = [];

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  constructor(
    private store: AngularFirestore,
    private authService: AuthService,
    private afStorage: AngularFireStorage,
    private router: Router,
    public locationService: LocationService,
    public location: Location
  ) {

  }

  upload(event) {

    let file = event.target.files[0];

    const fileReader = new FileReader();
    fileReader.addEventListener('load', (event) => {
      this.webcamImage = new WebcamImage(event.target.result as string, file.type, file);
    });
    fileReader.readAsDataURL(file);

    this.createPostState = CreatePostState.PREVIEW
  }

  async createPost(form: { caption: string }) {
    try {
      this.createPostButtonState = CreatePostButtonState.SAVING;

      const user = await this.authService.user.pipe(filter(user => !!user), first()).toPromise();
      const postId = this.store.createId();
      const filePath = 'users/' + user.uid + '/photos/posts/' + postId;
      const fileRef = this.afStorage.ref(filePath);
      const task = this.afStorage.upload(filePath, this.dataURLtoFile(this.webcamImage.imageAsDataUrl, postId));

      await task.snapshotChanges().toPromise();

      const photoUrl = await fileRef.getDownloadURL().toPromise();

      const location = await this.locationService.location.pipe(first()).toPromise();

      const post: Partial<Post> = {
        authorId: user.uid,
        photoUrls: [photoUrl],
        caption: form.caption,
        timePosted: Date.now(),
        latitude: location.latitude,
        longitude: location.longitude,
        geohash: geohash.encode(location.latitude, location.longitude)
      };

      await this.store.collection('users').doc(user.uid).collection('posts').add(post);

      await this.store.collection('users').doc(user.uid).update({
        postsCount: firebase.firestore.FieldValue.increment(1)
      });

      this.createPostButtonState = CreatePostButtonState.SAVED_SUCCESSFULLY;
      setTimeout(() => this.router.navigateByUrl("/home"), 1000);
    } catch(error) {
      console.log(error);
      this.createPostFirebaseError = error.message;
      this.createPostButtonState = CreatePostButtonState.NOT_SAVED_SUCCESSFULLY;
    } finally {
      setTimeout(() => this.createPostButtonState = CreatePostButtonState.UNSAVED, 5000);
    }
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  private dataURLtoFile(dataurl, filename) {

    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type:mime});
}

}
