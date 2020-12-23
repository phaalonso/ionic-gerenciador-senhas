import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacaoService, Usuario } from '../service/autenticacao.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  public formulario: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private autenticacaoService: AutenticacaoService,
    private router: Router
  ) {
    this.formulario = formBuilder.group({
      nome: ["", [Validators.required, Validators.minLength(5)]],
      senha: ["", [Validators.required, Validators.minLength(5)]],

    });
  }

  ngOnInit() {
  }

  submit() {
    if (!this.formulario.valid) {
      return;
    }

    const { nome, senha } = this.formulario.value;
    const usuario: Usuario = { nome, senha }

    this.autenticacaoService.cadastrarUsuario(usuario).then(isCadastrado => {
      if (isCadastrado) {
        this.router.navigate(['/home']);
      }
    });
  }

}
