import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

import { DetailPage } from '../detail/detail.page';
import { StorageService } from '../service/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticacaoService } from '../service/autenticacao.service';
import { Router } from '@angular/router';
import { CryptoService } from '../service/crypto.service';

export interface Conta {
  id: number;
  nome: string;
  login: string;
  senha: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public formCadastro: FormGroup;
  public conta = {} as any;
  public list_contas: Conta[] = [];

  constructor(
    private storage: StorageService,
    private alertController: AlertController,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private autenticacaoService: AutenticacaoService,
    private router: Router,
    private crypt: CryptoService
  ) {
    if (!this.autenticacaoService.isLogado()) {
      this.router.navigate(['/login']);
    }

    this.formCadastro = this.formBuilder.group({
      nome: ["", [Validators.required, Validators.minLength(5)]],
      login: ["", [Validators.required, Validators.minLength(5)]],
      senha: ["", [Validators.required, Validators.minLength(5)]],
    });

    this.storage.recuperar("contas").then(c => { if (c) this.list_contas = c });
  }

  cryptografarConta(conta: Conta) {
    conta.login = this.crypt.encryptAES(conta.login);
    conta.senha = this.crypt.encryptAES(conta.senha);
  }

  descriptografarConta(conta: Conta) {
    conta.login = this.crypt.decryptAES(conta.login);
    conta.senha = this.crypt.decryptAES(conta.senha);
  }

  async verDetalhes(id: number) {
    console.log('abrindo detalhes');
    const conta = this.list_contas.find(item => item.id == id);
    this.descriptografarConta(conta);

    const modal = await this.modalController.create({
      component: DetailPage,
      componentProps: {
        'conta': conta
      }
    })

    return await modal.present();
  }

  async mostrarAlerta(header: string, mensagem: string) {
    const alert = await this.alertController.create({
      cssClass: "alertClass",
      header: header,
      message: mensagem,
      buttons: ["Ok"]
    })

    await alert.present();
  }

  async mensagemAdicionar(conta) {
    const alert = await this.alertController.create({
      header: 'Confirme os dados',
      message: `Nome: ${conta.nome}<br/>Login: ${conta.login}<br/>Senha: ${conta.senha}`,
      buttons: [
        "Cancelar",
        {
          text: "Cadastrar",
          role: "cadastrar",
          handler: () => {
            this.conta.id = new Date().getTime();
            this.cryptografarConta(conta);
            this.list_contas.push(conta);

            this.conta = {};

            this.storage.armazenar("contas", this.list_contas);
            this.formCadastro.reset();
          }
        }
      ]
    });

    await alert.present();
  }

  adicionar() {
    if (!this.formCadastro.valid) {
      return;
    }

    const { nome, login, senha } = this.formCadastro.value;

    // Não se pode utilizar diretamente o objeto this.formCadastro.value devido a problemas com lixo de memória
    const conta = this.formCadastro.value; 

    console.log(conta);

    const isEqualsNome = this.list_contas.find(conta => conta.nome == this.formCadastro.value.nome);

    if (!isEqualsNome) {
      this.mensagemAdicionar(conta);
    } else {
      console.log("Nome igual");
      this.mostrarAlerta("Erro", "Já existe uma conta com esse nome");
      this.conta.nome = "";
    }

  }

  async excluir(id: number) {
    const conta = this.list_contas.find(item => item.id == id);

    const alert = await this.alertController.create({
      header: "Confirme a exclusão",
      message: `Você realmente deseja excluir a conta ${conta.nome}?`,
      buttons: [
        {
          text: "Cancelar",
          role: "cancelar",
          handler: () => console.log('Cancelada'),
        }, {
          text: "Excluir",
          role: "excluir",
          handler: () => {
            this.list_contas = this.list_contas.filter(c => c != conta);
            this.storage.armazenar("contas", this.list_contas);
          }
        }
      ]

    })

    await alert.present();
  }

  deslogar() {
    this.autenticacaoService.deslogar();
  }

}
