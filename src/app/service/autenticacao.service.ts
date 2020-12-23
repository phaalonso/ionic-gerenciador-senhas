import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';

export interface Usuario {
  nome: string;
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  private logado = false;
  private cadastrado: Usuario;

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {
    if (!this.cadastrado) {
      this.storageService.recuperar('login').then((usuario: Usuario) => {
        this.cadastrado = usuario;
      });
    }
  }

  async logar(usuario: Usuario) {
    if (!this.cadastrado) {
      this.cadastrado = await this.storageService.recuperar('login');
    }

    this.logado = (usuario.nome == this.cadastrado.nome) && (usuario.senha == this.cadastrado.senha);

    return this.logado;
  }

  deslogar() {
    this.logado = false;
  }

  isLogado() {
    return this.logado;
  }

  isCadastrado() {
    return new Promise(resolve => {
      if (this.cadastrado)
        resolve(true);
      this.storageService.recuperar('login').then(usuario => {
        if (usuario) {
          console.log(usuario);
          this.cadastrado = usuario;
          resolve(true);
        }
        resolve(false);
      });
    });
  }

  async cadastrarUsuario(usuario: Usuario) {
    await this.storageService.armazenar('login', usuario);
    this.logado = true;
    return this.logado;
  }
}
