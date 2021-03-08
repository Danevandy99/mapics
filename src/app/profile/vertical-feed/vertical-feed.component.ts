import { LocationService } from './../../shared/service/location.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Params } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { Post } from 'src/app/shared/models/post';

@Component({
  selector: 'app-vertical-feed',
  templateUrl: './vertical-feed.component.html',
  styleUrls: ['./vertical-feed.component.scss']
})
export class VerticalFeedComponent implements OnInit {

  posts: Post[];

  constructor(
    private store: AngularFirestore,
    private route: ActivatedRoute,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe((params: Params) => {
      this.getUserPosts(params.id);
    });
  }

  async getUserPosts(id: string) {
    const location = await this.locationService.location.pipe(first()).toPromise();

    this.store.collection('users').doc(id).collection('posts', ref => ref.orderBy('timePosted', 'desc'))
      .get()
      .pipe(
        map(docs => {
          return docs.docs.map(doc => {
            let post = { ...<object>doc.data(), postId: doc.id } as Post;
            post.distance = this.calculateDistance(post.latitude, post.longitude, location.latitude, location.longitude, 'M')
            return post;
          });
        })
      )
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  calculateDistance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist;
    }
  }

}
