import { Router } from '@angular/router';
import { AuthService } from './../../shared/service/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  get isHomePage(): boolean {
    return this.router.url === '/home';
  }

  ngOnInit(): void {
  }

}
