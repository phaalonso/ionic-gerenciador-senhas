import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Conta } from '../home/home.page';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  @Input() conta: Conta;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  fecharModal() {
    console.log('Fechando o modal');
    this.modalController.dismiss();
  }
}
