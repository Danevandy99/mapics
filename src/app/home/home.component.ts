import { FeedService } from './../shared/service/feed.service';
import { LocationService } from './../shared/service/location.service';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { Post } from '../shared/models/post';
import { map, first, concatAll, toArray, tap, switchMap } from 'rxjs/operators';
import { concat, forkJoin, merge, Observable } from 'rxjs';
const geofire = require('geofire-common');


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private store: AngularFirestore,
    private locationService: LocationService,
    public feedService: FeedService
  ) { }

  ngOnInit() {
    this.feedService.setPosts(this.getPosts());
  }

  getPosts(): Observable<Post[]> {
    return this.locationService.location
      .pipe(
        first(),
        switchMap(location => {
          const miles = 10;
          const meters = miles * 1609.34;
          const bounds = geofire.geohashQueryBounds([location.latitude, location.longitude], meters);
          let queries = [];

          for (const b of bounds) {
            const query = this.store.collectionGroup('posts', ref => ref.orderBy('geohash').startAt(b[0]).endAt(b[1])).get();
            queries.push(query);
          }

          return concat(...queries)
            .pipe(
              toArray(),
              map((snapshots: QuerySnapshot<Post[]>[]) => {
                return [].concat(...snapshots.map(snapshot => {
                  return snapshot.docs.map(doc => {
                    let post = {
                      ...<object>doc.data(),
                      postId: doc.id,
                    } as Post;
                    post.distance = this.calculateDistance(post.latitude, post.longitude, location.latitude, location.longitude, 'M')
                    return post;
                  })
                }))
                  // Filter out false positives
                  .filter((post: Post) => {
                    return geofire.distanceBetween([post.latitude, post.longitude], [location.latitude, location.longitude]) * 1000 <= meters;
                  })
                  // Sort by post time, descending
                  .sort((a: Post, b: Post) => {
                    return b.timePosted - a.timePosted;
                  });
              })
            )
        })
      )
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
