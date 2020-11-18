import { Injectable } from '@angular/core';

import { Storage } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async armazenar(key: string, valor: any) {
    await Storage.set({
      key,
      value: JSON.stringify(valor)
    })
  }

  async recuperar(key: string) {
    const { value: data } = await Storage.get({ key });
    return JSON.parse(data);
  }
}
