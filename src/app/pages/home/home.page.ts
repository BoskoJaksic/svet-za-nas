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
    name:"Porodica",
    iconSrc: "people-outline"
  },
    {
      pageUrl:'profile',
      name:"Profil",
      iconSrc:"person-outline"
    },
    {
      pageUrl:'settings',
      name:"Podesavanja",
      iconSrc:"settings-outline"
    }
  ]
  constructor() { }

  ngOnInit() {
  }


}
