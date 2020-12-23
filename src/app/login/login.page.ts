import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private autenticacaoService: AutenticacaoService,
    private router: Router
  ) {
    this.formulario = formBuilder.group({
      nome: ["", [Validators.required, Validators.minLength(5)]],
      senha: ["", [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.autenticacaoService.isCadastrado().then(isCadastrado => {
      console.log(isCadastrado);
      if (!isCadastrado)
        this.router.navigate(['/cadastro']);
    });
  }

  submit() {
    if (!this.formulario.valid) {
      return;
    }

    console.log(this.formulario.value);
    this.autenticacaoService.logar(this.formulario.value).then(isLogado => {
      if (isLogado) {
        this.router.navigate(['/home']);
      }
    });
  }

}
