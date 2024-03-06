import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {

  @Input() personObj: any

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  calculateYears() {
    if (this.personObj?.dateOfBirth) {
      const today = new Date();
      const dobParts = this.personObj?.dateOfBirth.split('-');
      const dateOfBirth = new Date(+dobParts[0], dobParts[1] - 1, +dobParts[2]);

      let noOfYears = today.getFullYear() - dateOfBirth.getFullYear();

      // Check if the birthday for this year has passed
      if (today.getMonth() < dateOfBirth.getMonth() ||
        (today.getMonth() === dateOfBirth.getMonth() && today.getDate() < dateOfBirth.getDate())) {
        noOfYears--;
      }
      return noOfYears;
    }
    return
  }

  goTo() {
    console.log('childobj', this.personObj)
    const queryParams = encodeURIComponent(JSON.stringify(this.personObj));
    this.router.navigate(['home/profile/profile-details'], {queryParams: {data: queryParams}});
  }

}
