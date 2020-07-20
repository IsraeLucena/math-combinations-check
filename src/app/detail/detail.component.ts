import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import * as _ from 'lodash'
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

interface Combination {
  name: string;
  values: number[];
  matches: boolean[];
  count: number;
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  combinations: Combination[];
  countCombinations: number;
  nameListGames: string;
  constructor() {
    let count = JSON.parse(localStorage.getItem('countCombinations'));
    this.countCombinations = count ? count : 0;

    let combs = JSON.parse(localStorage.getItem('dataSource'));
    this.combinations = combs ? combs : [];

    this.nameListGames = 'backupDataSource' + this.countCombinations;
  }

  private _success = new Subject<string>();
  private _alert = new Subject<string>();
  staticAlertClosed = false;
  successMessage = '';
  alertMessage = '';

  ngOnInit(): void {
    setTimeout(() => this.staticAlertClosed = true, 20000);
    this._alert.subscribe(message => this.alertMessage = message);
    this._alert.pipe(
      debounceTime(5000)
    ).subscribe(() => this.alertMessage = '');

    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = '');
  }

  valueParse(value) {
    return parseInt(value, 10) < 10 ? value = '0' + value : value;
  }

  resetPoints() {
    this.combinations.forEach(element => {
      element.count = 0;
      element.matches = [false, false, false, false, false, false, false, false, false, false];
    });

    localStorage.setItem('dataSource', JSON.stringify(this.combinations));
    localStorage.setItem(this.nameListGames, JSON.stringify(this.combinations));

  }

  resetGames() {
    localStorage.setItem(this.nameListGames, JSON.stringify(this.combinations));
    localStorage.setItem('countCombinations', (++this.countCombinations).toString());

    this.combinations = [];
    localStorage.setItem('dataSource', JSON.stringify(this.combinations));
  }

  addCombination(newGame: NgForm) {
    let maiorQ99 = false;
    let menorQ0 = false;
    let values = newGame.value.dezenas.split("-");
    values.sort();
    values.forEach(element => {
      if (parseInt(element, 10) > 99) {
        maiorQ99 = true;
      }
      if (parseInt(element, 10) < 0) {
        menorQ0 = true;
      }
    });
    let combination = {
      name: newGame.value.name,
      values: values,
      matches: [false, false, false, false, false, false, false, false, false, false],
      count: 0
    };
    let uniqValues = _.uniq(combination.values).length == 10 ? true : false;
    if (uniqValues && !menorQ0 && !maiorQ99) {
      this.combinations.push(combination);
      localStorage.setItem('dataSource', JSON.stringify(this.combinations));
      localStorage.setItem(this.nameListGames, JSON.stringify(this.combinations));

      this._success.next(`Jogo Adicionado!`);
    } else if (menorQ0) {
      this._alert.next(`Valores Menor Que Zero!`);
    } else if (maiorQ99) {
      this._alert.next(`Valores Maior Que Zero!`);
    } else {
      this._alert.next(`Valores Repetidos!`);
    }
  }

  calculatePoints(prem) {
    let maiorQ99 = false;
    let menorQ0 = false;
    // let premio = [prem.v1, prem.v2, prem.v3, prem.v4, prem.v5,
    // prem.v6, prem.v7, prem.v8, prem.v9, prem.v10];
    let premio = prem.value.dezenas.split("-");

    premio.forEach(element => {
      if (parseInt(element, 10) > 99) {
        maiorQ99 = true;
      }
      if (parseInt(element, 10) < 0) {
        menorQ0 = true;
      }
    });

    let uniqValues = _.uniq(premio).length == 10 ? true : false;
    if (uniqValues && !menorQ0 && !maiorQ99) {
      this.combinations.forEach(game => {
        game.values.forEach(number => {
          let position = game.values.indexOf(number);
          if (premio.includes(number) && !game.matches[position]) {
            game.matches[position] = true;
            ++game.count;
          }
        });
      });

      localStorage.setItem('dataSource', JSON.stringify(this.combinations));
      localStorage.setItem(this.nameListGames, JSON.stringify(this.combinations));

      this._success.next(`Resultado Realizado!`);
    } else if (menorQ0) {
      this._alert.next(`Valores Menor Que Zero!`);
    } else if (maiorQ99) {
      this._alert.next(`Valores Maior Que Zero!`);
    } else {
      this._alert.next(`Valores Repetidos!`);
    }
  }
}
