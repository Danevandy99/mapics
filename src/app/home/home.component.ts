import { Component, OnInit } from '@angular/core';
import { Post } from '../shared/models/post';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  posts: Partial<Post>[] = [
    { photoUrls: ["https://images.unsplash.com/photo-1612712590265-27d523d95f43?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80"] },
    { photoUrls: ["https://images.unsplash.com/photo-1612712590265-27d523d95f43?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80"] },
    { photoUrls: ["https://images.unsplash.com/photo-1612712590265-27d523d95f43?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80"] },
    { photoUrls: ["https://images.unsplash.com/photo-1612712590265-27d523d95f43?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80"] },
    { photoUrls: ["https://images.unsplash.com/photo-1612712590265-27d523d95f43?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80"] },
    { photoUrls: ["https://images.unsplash.com/photo-1612712590265-27d523d95f43?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80"] },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
