import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/shared/models/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: Partial<Post>;

  constructor() { }

  ngOnInit(): void {
  }

}
