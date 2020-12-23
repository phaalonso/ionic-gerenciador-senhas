import { Injectable } from '@angular/core';

import { AES, enc } from 'crypto-js';

import { key } from 'src/environments/encryptKey';
import { Conta } from '../home/home.page';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private chave: string;

  constructor() {
    this.chave = key;

    if (!this.chave) {
      throw Error('Não foi possivel acessar a chave de criptografia');
    }

  }

  encryptAES(content) {
    return AES.encrypt(content, this.chave).toString();
  }

  decryptAES(content) {
    return AES.decrypt(content, this.chave).toString(enc.Utf8);
  }

  encryptConta(conta: Conta) {
    conta.login = this.encryptAES(conta.login);
    conta.senha = this.encryptAES(conta.senha);
  }

  decryptConta(conta: Conta) {
    conta.login = this.decryptAES(conta.login);
    conta.senha = this.decryptAES(conta.senha);
  }

}
