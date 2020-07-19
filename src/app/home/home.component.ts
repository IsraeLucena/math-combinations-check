import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = '');
  }

  login(form){
    if(form.login == 'cassio' && form.password == 'cassio1233'){
      this.router.navigate(['/detail']);
      this._success.next(`Login com Sucesso.`);
    }else{
      this._success.next(`Login ou senha inválido.`);
    }
  }

}
