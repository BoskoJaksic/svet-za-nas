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
      let noOfMonths = today.getMonth() - dateOfBirth.getMonth();
      let totalMonths = (noOfYears * 12) + noOfMonths;

      // Check if the birthday for this year has passed
      if (today.getMonth() < dateOfBirth.getMonth() ||
        (today.getMonth() === dateOfBirth.getMonth() && today.getDate() < dateOfBirth.getDate())) {
        noOfYears--;
        totalMonths -= 12; // Subtract 12 months if birthday hasn't passed yet
      }

      return { years: noOfYears, months: totalMonths };
    }
    return { years: 0, months: 0 }; // Return default values if date of birth is not available
  }


  goTo() {
    console.log('childobj', this.personObj)
    const queryParams = encodeURIComponent(JSON.stringify(this.personObj));
    this.router.navigate(['home/profile/profile-details'], {queryParams: {data: queryParams}});
  }

}
