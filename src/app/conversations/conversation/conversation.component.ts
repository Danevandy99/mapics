import { UserSettings } from 'src/app/shared/models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from './../../shared/models/message';
import { Conversation } from './../../shared/models/conversation';
import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/shared/service/auth.service';
import { filter, switchMap, mergeMap, first, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {

  blankImage: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  conversation: Conversation;
  messages$: Observable<Message[]>;

  constructor(
    private store: AngularFirestore,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getConversation();
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

}
