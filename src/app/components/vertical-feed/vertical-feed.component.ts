import { FeedService } from './../../shared/service/feed.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'src/app/shared/models/post';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-vertical-feed',
  templateUrl: './vertical-feed.component.html',
  styleUrls: ['./vertical-feed.component.scss']
})
export class VerticalFeedComponent implements OnInit {
  error: string;
  posts$: Observable<Post[]> = this.feedService.posts
    .pipe(
      catchError(error => {
        this.error = error as string;
        console.log(error)
        throw error;
      })
    );

  constructor(
    public feedService: FeedService,
    public window: Window,
  ) { }

  ngOnInit(): void {

  }

}
