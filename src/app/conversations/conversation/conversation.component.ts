import { UserSettings } from 'src/app/shared/models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from './../../shared/models/message';
import { Conversation } from './../../shared/models/conversation';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/shared/service/auth.service';
import { filter, switchMap, first, map, tap } from 'rxjs/operators';
import firebase from 'firebase';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  @ViewChild('messagesSection') messagesSection: ElementRef;
  blankImage: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  conversation: Conversation;
  messages$: Observable<Message[]>;
  newMessage: string;
  sending = false;

  constructor(
    private store: AngularFirestore,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getConversation();

    this.messages$ = this.getMessages();
  }

  ngAfterViewChecked() {
    this.messagesSection.nativeElement.scrollTop = this.messagesSection.nativeElement.scrollHeight;
  }

  get currentUser(): Observable<firebase.User> {
    return this.authService.user.pipe(
      filter(user => !!user)
    )
  }

  getMessages(): Observable<Message[]> {
    return combineLatest([
      this.route.params,
      this.authService.user.pipe(
        filter(user => !!user),
        first()
      )
    ])
      .pipe(
        switchMap(result => {
          return this.store.collection('users').doc(result[1].uid).collection('conversations').doc(result[0].id).collection('messages', ref => ref.orderBy('timestamp')).snapshotChanges();
        }),
        map(docChanges => {
          return docChanges.map(changes => {
            return changes.payload.doc.data() as Message;
          })
        })
      )
  }

  getConversation() {
    combineLatest([
      this.route.params,
      this.authService.user.pipe(
        filter(user => !!user),
        first()
      )
    ]).pipe(
      switchMap(result => {
        return this.store.collection('users').doc(result[1].uid).collection('conversations').doc(result[0].id).get()
      }),
      map(doc => {
        return { ...<object>doc.data(), userID: doc.id } as Conversation;
      }),
      tap(conversation => this.conversation = conversation),
      switchMap(conversation => {
        return this.store.collection('users').doc(conversation.userID).get()
      }),
      map(doc => {
        return { ...<object>doc.data(), userId: doc.id } as UserSettings;
      })
    ).subscribe(userSettings => {
      this.conversation.user = userSettings;
    })
  }

  async sendMessage() {
    try {
      this.sending = true;
      const user = await this.authService.user.pipe(filter(user => !!user), first()).toPromise();

      const message: Message = {
        senderID: user.uid,
        receiverID: this.conversation.userID,
        messageText: this.newMessage,
        timestamp: Date.now()
      };

      // Add message to current user messages
      await this.store.collection('users').doc(user.uid).collection('conversations').doc(this.conversation.userID).collection('messages').add(message);
      await this.store.collection('users').doc(user.uid).collection('conversations').doc(this.conversation.userID).set({
        lastSentMessage: this.newMessage,
        lastSentMessageTime: Date.now()
      });

      // Add to recipient messages
      await this.store.collection('users').doc(this.conversation.userID).collection('conversations').doc(user.uid).collection('messages').add(message);
      await this.store.collection('users').doc(this.conversation.userID).collection('conversations').doc(user.uid).set({
        lastSentMessage: this.newMessage,
        lastSentMessageTime: Date.now()
      });

      this.newMessage = "";
    } catch (error) {
      alert("Error sending message: " + error);
    } finally {
      this.sending = false;
    }
  }

}
