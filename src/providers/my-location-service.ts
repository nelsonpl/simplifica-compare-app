
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class MyLocationService {

  constructor(private storage: Storage) {
  }

  get() {
    return this.storage.get('MY_LOCATION');
  }

  set(location: string) {
    return this.storage.set('MY_LOCATION', location);
  }

}