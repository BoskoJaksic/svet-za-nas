import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NavController} from "@ionic/angular";
import {LoaderService} from "../../../../common/services/loader.service";

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage implements OnInit {
  receivedObject: any;

  constructor(private route: ActivatedRoute,
              private loaderService:LoaderService,
              private navController: NavController
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.loaderService.showLoader();
      const encodedObject = params['data'];
      setTimeout(()=>{
        this.loaderService.hideLoader();
      },100)
      this.receivedObject = JSON.parse(decodeURIComponent(encodedObject));
      console.log('received', this.receivedObject)
    });
  }

  calculateYears() {
    const today = new Date();
    const dobParts = this.receivedObject.dateOfBirth.split('-');
    const dateOfBirth = new Date(+dobParts[0], dobParts[1] - 1, +dobParts[2]);

    let noOfYears = today.getFullYear() - dateOfBirth.getFullYear();

    // Check if the birthday for this year has passed
    if (today.getMonth() < dateOfBirth.getMonth() ||
      (today.getMonth() === dateOfBirth.getMonth() && today.getDate() < dateOfBirth.getDate())) {
      noOfYears--;
    }
    return noOfYears;
  }



  goBack() {
    this.navController.navigateBack('home/profile')
  }
}
