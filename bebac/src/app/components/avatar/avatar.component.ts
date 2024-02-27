import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from "../../common/services/common.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  @Input() personId: any
  @Input() childObj: any

  constructor(public commonService: CommonService,private router: Router) {
  }

  ngOnInit() {
  }

  goTo(){
    console.log('childobj',this.childObj)
    const queryParams = encodeURIComponent(JSON.stringify(this.childObj));
    this.router.navigate(['home/profile/profile-details'], { queryParams: { data: queryParams } });

  }

}
