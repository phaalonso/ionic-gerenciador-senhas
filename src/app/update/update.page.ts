import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Conta } from '../home/home.page';
import { CryptoService } from '../service/crypto.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage {


  @Input() conta: Conta;
  public formCadastro: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private crypt: CryptoService
  ) {
  }

  ngOnInit() {
    this.crypt.decryptConta(this.conta);
    this.formCadastro = this.formBuilder.group({
      nome: [this.conta.nome, [Validators.required, Validators.minLength(5)]],
      login: [this.conta.login, [Validators.required, Validators.minLength(5)]],
      senha: [this.conta.senha, [Validators.required, Validators.minLength(5)]],
    });
  }

  atualizar() {
    if (this.formCadastro.invalid) {
      return;
    }

    const conta = {
      nome: this.formCadastro.get('nome'),
      login: this.formCadastro.get('login'),
      senha: this.formCadastro.get('senha')
    }

    this.modalController.dismiss(conta);
  }

}
