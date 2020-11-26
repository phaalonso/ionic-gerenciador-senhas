import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import * as CryptoJs from 'crypto-js';

import { DetailPage } from '../detail/detail.page';
import { StorageService } from '../service/storage.service';
import { key as chave } from 'src/environments/encryptKey';

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

  public conta = {} as any;
  public list_contas: Conta[] = [];

  constructor(private storage: StorageService, private alertController: AlertController, public modalController: ModalController) {
    this.storage.recuperar("contas").then(c => { if (c) this.list_contas = c });
  }

  cryptografarConta(conta: Conta) {
    conta.login = CryptoJs.AES.encrypt(conta.login, chave).toString();
    conta.senha = CryptoJs.AES.encrypt(conta.senha, chave).toString();
  }

  descriptografarConta(conta: Conta) {
    conta.login = CryptoJs.AES.decrypt(conta.login, chave).toString(CryptoJs.enc.Utf8);
    conta.senha = CryptoJs.AES.decrypt(conta.senha, chave).toString(CryptoJs.enc.Utf8);
  }

  async verDetalhes(id: number) {
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

  async mensagemAdicionar() {
    const alert = await this.alertController.create({
      header: 'Confirme os dados',
      message: `Nome: ${this.conta.nome}<br/>Login: ${this.conta.login}<br/>Senha: ${this.conta.senha}`,
      buttons: [
        "Cancelar",
        {
          text: "Cadastrar",
          role: "cadastrar",
          handler: () => {
            this.conta.id = new Date().getTime();
            this.cryptografarConta(this.conta);
            this.list_contas.push(this.conta);

            this.conta = {};

            this.storage.armazenar("contas", this.list_contas);
          }
        }
      ]
    });

    await alert.present();
  }

  adicionar() {
    if (!this.conta.nome || !this.conta.login || !this.conta.senha) {
      this.mostrarAlerta("Erro", "Você precisa inserir todas as informações");

      return;
    }


    const isEqualsNome = this.list_contas.find(conta => conta.nome == this.conta.nome);

    if (!isEqualsNome) {
      this.mensagemAdicionar();
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

}
