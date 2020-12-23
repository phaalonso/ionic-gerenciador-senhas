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
    if (this.logado) {
      this.router.navigate(['/home']);
    }
  }

  logar(usuario: Usuario) {
    if (usuario.nome == usuario.senha) {
      this.logado = true;
      this.router.navigate(['/home']);
    } else {
      this.logado = false;
    }

  }

  deslogar() {
    this.logado = false;
    this.router.navigate(['/login']);
  }

  isLogado() {
    return this.logado;
  }

  async cadastrarUsuario(usuario: Usuario) {
    this.storageService.armazenar('login', usuario).then(() => {
      this.logado = true;
      this.router.navigate(['/home']);
    });
  }
}
