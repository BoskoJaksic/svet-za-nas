import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {
  email: string = ''
  password: string = ''
  rememberMe: boolean = false
  @Output() loginChanged = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {}
  showRegisterPage(){
    this.loginChanged.emit(false);

  }
  onSubmit() {
    const formData = {
      email: this.email,
      password: this.password,
      rememberMe:this.rememberMe
    };
    console.log(formData)
  }


}
