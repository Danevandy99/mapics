import { FeedService } from './../../shared/service/feed.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vertical-feed',
  templateUrl: './vertical-feed.component.html',
  styleUrls: ['./vertical-feed.component.scss']
})
export class VerticalFeedComponent implements OnInit {

  constructor(
    public feedService: FeedService
  ) { }

  ngOnInit(): void {
  }

}
