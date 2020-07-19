import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import * as _ from 'lodash'

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
export class DetailComponent {
  combinations: Combination[];
  countCombinations: number;

  constructor() {
    let count = JSON.parse(localStorage.getItem('countCombinations'));
    this.countCombinations = count? count: 0;

    let combs = JSON.parse(localStorage.getItem('dataSource'));
    this.combinations = combs? combs : [];
  }

  valueParse(value) {
    return parseInt(value, 10) < 10 ? value = '0' + value : value;
  }

  resetPoints() {
    this.combinations.forEach(element => {
      element.count = 0;
      element.matches = [false, false, false, false, false, false, false, false, false, false];
    });
  }

  resetGames(){
    this.combinations = [];
    localStorage.setItem('dataSource', JSON.stringify(this.combinations));

  }

  addCombination(f: NgForm) {
    let combination = {
      name: f.value.name,
      values: [f.value.v1, f.value.v2, f.value.v3, f.value.v4, f.value.v5,
      f.value.v6, f.value.v7, f.value.v8, f.value.v9, f.value.v10],
      matches: [false, false, false, false, false, false, false, false, false, false],
      count: 0
    };
    let uniqValues = _.uniq(combination.values).length == 10 ? true : false;
    if (uniqValues) {
      this.combinations.push(combination);
      localStorage.setItem('dataSource', JSON.stringify(this.combinations));
      alert('Jogo Adicionado!')
    } else {
      alert('Algo está errado!')
    }

  }

  calculatePoints(comb) {
    let premio = [comb.v1, comb.v2, comb.v3, comb.v4, comb.v5,
    comb.v6, comb.v7, comb.v8, comb.v9, comb.v10];
    let uniqValues = true;
    // let uniqValues = _.uniq(premio).length == 10 ? true : false;
    if (uniqValues) {
      this.combinations.forEach(game => {
        game.values.forEach(number => {
          if (premio.includes(number)) {
            let position = game.values.indexOf(number);
            game.matches[position] = true;
            ++game.count;
          }
        });
      });
      alert('Resultado realizado!');
    } else {
      alert('Algo está errado!');
    }

  }

}
