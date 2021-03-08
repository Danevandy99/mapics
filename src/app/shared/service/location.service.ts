import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private _location: BehaviorSubject<{ latitude: number, longitude: number}> = new BehaviorSubject<{ latitude: number, longitude: number}>(null);
  public location: Observable<{ latitude: number, longitude: number}> = this._location.asObservable().pipe(
    filter(location => !!location)
  )

  constructor() {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          if (position) {
            this._location.next({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
          }
        },
        error => console.log(error),
        {
          maximumAge: 3000,
          enableHighAccuracy: false
        });
      } else {
        throw new console.error("Could not access location");
      }
    }
    catch(error){
      console.log(error);
    }
  }
}
