import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonService} from "../../common/services/common.service";

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

  constructor(private commonService:CommonService) { }

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
    this.commonService.goToRoute('home')
  }
}
