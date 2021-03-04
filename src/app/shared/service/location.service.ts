import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  longitude: number; 
  latitude: number; 
  constructor() { }
  ngOnInit() {
    try{
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position  => {
          if (position) {
            this.longitude = position.coords.latitude;
            this.latitude = position.coords.longitude;
          }
        },
        );
      } else {
        throw new console.error("Could not access location");        
      }
    }
    catch(error){
      console.log(error);
    }
  }
}
