import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Conta } from '../home/home.page';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  
  @Input()
  public set conta(val: Conta) {
    this._conta = val;
    this.formCadastro = this.formBuilder.group({
      nome: [this._conta.nome, [Validators.required, Validators.minLength(5)]],
      login: [this._conta.login, [Validators.required, Validators.minLength(5)]],
      senha: [this._conta.senha, [Validators.required, Validators.minLength(5)]],
    });

    console.log(this._conta);
  }

  private _conta: Conta;
  public formCadastro: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
  }

}
