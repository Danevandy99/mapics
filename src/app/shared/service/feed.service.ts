import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private _posts: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>(null);
  public posts: Observable<Post[]> = this._posts.asObservable().pipe(
    filter(posts => !!posts)
  )

  constructor() { }

  setPosts(posts$: Observable<Post[]>) {
    this._posts.next(null);
    posts$.subscribe({
      next: v => this._posts.next(v),
      error: v => this._posts.error(v)
    })
  }
}
