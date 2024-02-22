import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from "../../common/services/common.service";

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  @Input() personId: any

  constructor(public commonService: CommonService) {
  }

  ngOnInit() {
  }

}
