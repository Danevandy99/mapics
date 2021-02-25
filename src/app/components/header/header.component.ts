import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './../../shared/service/auth.service';
import { Component, OnInit } from '@angular/core';
import { filter, map } from 'rxjs/operators';

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

  get currentUserId(): Observable<string> {
    return this.authService.user
      .pipe(
        filter(user => !!user),
        map(user => user.uid)
      );
  }

  get isHomePage(): boolean {
    return this.router.url === '/home';
  }

  ngOnInit(): void {
  }

}
