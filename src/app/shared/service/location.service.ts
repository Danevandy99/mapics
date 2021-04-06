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
    this.getLocation();
  }

  getLocation() {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          if (position) {
            this._location.next({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
          } else {
            this._location.error("Could not get location at this time. Please make sure you have location permissions enabled for your browser.");
          }
        },
        error => this._location.error("Could not get location at this time. Please make sure you have location permissions enabled for your browser."),
        {
          maximumAge: 3000,
          enableHighAccuracy: false,
          timeout: 5000
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
