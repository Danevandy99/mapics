import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { filter, map, switchMap } from 'rxjs/operators';
import { Conversation } from '../shared/models/conversation';
import { UserSettings } from '../shared/models/user';
import { AuthService } from '../shared/service/auth.service';

@Component({
  selector: 'app-messages',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit {

  conversations: Conversation[];
  blankImage: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

  constructor(
    private store: AngularFirestore,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.retreiveMessages();
  }

  retreiveMessages() {
    this.auth.user.pipe(
      filter(user => !!user),
      switchMap(user => {
        return this.store.collection('users').doc(user.uid).collection('conversations', ref => ref.orderBy('lastSentMessageTime', 'desc'))
        .get()
        .pipe(
          map(docs => {
            return docs.docs.map( doc => {
              return { ...<Object>doc.data(), userID: doc.id } as Conversation
            })
          })
        )
      })
    )
    .subscribe(conversations => {
      this.conversations = conversations;
      this.conversations.forEach(conversation => {
        this.store.collection('users').doc(conversation.userID)
        .get()
        .pipe( map
          (doc => {
            return { ...<object>doc.data(), userId: doc.id } as UserSettings;
          })
        )
        .subscribe(userSetting => {
          conversation.user = userSetting;
        })
      });
    });


}

}
