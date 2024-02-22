import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonService} from "../../common/services/common.service";
import {LoginService} from "../../common/services/login-register/login.service";

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

  constructor(private commonService:CommonService,private loginService:LoginService) { }

  ngOnInit() {}
  showRegisterPage(){
    this.loginChanged.emit(false);

  }
  onSubmit() {
    const formData = {
      username: this.email,
      password: this.password,
      // rememberMe:this.rememberMe
    };
    console.log(formData)
    this.loginService.loginUser(formData).subscribe({
      next: (r) => {
        console.log('r', r)
        this.commonService.goToRoute('home')
      }, error: (err) => {
        console.log('err', err)
      }
    })


  }
}
