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
  receivedObject: any;

  constructor(private route: ActivatedRoute,
              public commonService:CommonService,
              private navController: NavController

  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const encodedObject = params['data'];
      this.receivedObject = JSON.parse(decodeURIComponent(encodedObject));
      console.log('received',this.receivedObject)
    });
  }

  getProfileData() {

  }

  goBack(){
    this.navController.navigateBack('home/profile')
  }
}
