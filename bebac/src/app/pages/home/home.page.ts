import { Component, OnInit } from '@angular/core';
import {SideBarModel} from "../../models/sideBar.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  sidebarsUrl: SideBarModel[] = [{
    pageUrl:'in-app-browser',
    name:"In app",
    iconSrc: ""
  },
    {
      pageUrl:'profile',
      name:"Profile",
      iconSrc:""
    }
  ]
  constructor() { }

  ngOnInit() {
  }


}
