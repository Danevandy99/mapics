import { Component, OnInit } from '@angular/core';

export enum ProfileTabState {
  HIGHLIGHTS = 0,
  GRID = 1,
  VERTICAL = 2
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileTabState: ProfileTabState = ProfileTabState.HIGHLIGHTS;

  constructor() { }

  ngOnInit(): void {
  }

}
