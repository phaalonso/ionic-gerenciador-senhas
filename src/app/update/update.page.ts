import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Conta } from '../home/home.page';
import { CryptoService } from '../service/crypto.service';

export interface ContaPartition {
  nome: string;
  login: string;
  senha: string;
}

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage {


  @Input() dados: ContaPartition;
  @Input() listaContas: Conta[];

  public formCadastro: FormGroup;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.formCadastro = this.formBuilder.group({
      nome: [this.dados.nome, [Validators.required, Validators.minLength(5)]],
      login: [this.dados.login, [Validators.required, Validators.minLength(5)]],
      senha: [this.dados.senha, [Validators.required, Validators.minLength(5)]],
    });
  }

  atualizar() {
    if (this.formCadastro.invalid) {
      return;
    }

    const conta = {
      nome: this.formCadastro.get('nome').value,
      login: this.formCadastro.get('login').value,
      senha: this.formCadastro.get('senha').value
    }

    console.log(this.dados);

    if (this.dados.nome != conta.nome) {
      if (!!this.listaContas.find(ac => ac.nome == conta.nome)) {
        this.alertController.create({
          header: 'Error',
          message: 'Já existe uma conta com esse nome',
          buttons: ['Oks']
        }).then(alert => {
          alert.present();
        });

        return;
      }
    }

    this.formCadastro.reset();
    this.modalController.dismiss(conta);
  }

}
