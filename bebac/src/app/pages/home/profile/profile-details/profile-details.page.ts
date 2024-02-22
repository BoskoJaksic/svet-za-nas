import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CommonService} from "../../../../common/services/common.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage implements OnInit {

  constructor(private route: ActivatedRoute,
              public commonService:CommonService,
              private navController: NavController

  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(async params => {
      const paramId = params['id'];
      console.log('paramId', paramId)
      this.getProfileData()
    })
  }

  getProfileData() {

  }

  goBack(){
    this.navController.navigateBack('home/profile')
  }
}
