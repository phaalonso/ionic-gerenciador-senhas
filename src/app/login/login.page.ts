import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticacaoService } from '../service/autenticacao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public formulario: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private autenticacaoService: AutenticacaoService
  ) {
    this.formulario = formBuilder.group({
      nome: ["", [Validators.required, Validators.minLength(5)]],
      senha: ["", [Validators.required, Validators.minLength(5)]]
    });
  }

  submit() {
    if (!this.formulario.valid) {
      return;
    }

    console.log(this.formulario.value);
    this.autenticacaoService.logar(this.formulario.value);

  }

  ngOnInit() {
  }

}
