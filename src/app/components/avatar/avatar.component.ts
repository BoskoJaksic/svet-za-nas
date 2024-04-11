import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {

  @Input() personObj: any
  age: number | null = null;
  message: string = '';

  constructor(private router: Router) {

  }

  ngOnInit() {
    if (this.personObj) {
      this.calculateAgeOrPregnancy(this.personObj.dateOfBirth);
    }
  }

  private calculateAgeOrPregnancy(dateString: string): void {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    if (givenDate > currentDate) {
      const daysUntilDueDate = Math.floor((givenDate.getTime() - currentDate.getTime()) / oneDay);
      const weeksUntilDueDate = Math.floor(daysUntilDueDate / 7);
      const weeksPregnant = 40 - weeksUntilDueDate;
      this.message = `${weeksPregnant} nedelja trudnaoce`;
    } else {
      const monthsOld = Math.floor((currentDate.getTime() - givenDate.getTime()) / (30 * oneDay));
      if (monthsOld < 12) {
        this.message = `${monthsOld} meseci`;
      } else {
        let ageYears = currentDate.getFullYear() - givenDate.getFullYear();
        if (currentDate.getMonth() < givenDate.getMonth() ||
          (currentDate.getMonth() == givenDate.getMonth() && currentDate.getDate() < givenDate.getDate())) {
          ageYears--;
        }
        this.message = `${ageYears} godina`;
      }
    }
  }

  isFutureDate(dateOfBirth:any): boolean {
    const currentDate = new Date();
    const targetDate = new Date(dateOfBirth);
    return targetDate > currentDate;
  }


  generateImg() {
    if (this.personObj?.profilePicture) {
      return this.personObj.profilePicture
    } else {
      if (this.personObj?.parentRole) {
        if (this.personObj?.parentRole === 'mom') {
          return './assets/images/mom.png'
        } else {
          return '/assets/images/dad.png'
        }
      } else if (this.personObj.gender) {
        if (this.isFutureDate(this.personObj.dateOfBirth)) {
          return '/assets/images/baby.png'
        } else {

          if (this.personObj.gender === 'boy') {
            return '/assets/images/boy.png'
          } else if (this.personObj.gender === 'girl') {
            return '/assets/images/girl.png'
          } else {
            return '/assets/images/baby.png'
          }
        }
      } else {
        return '/assets/images/pet.png'
      }
    }
  }


  goTo() {
    const queryParams = encodeURIComponent(JSON.stringify(this.personObj));
    this.router.navigate(['home/profile/profile-details'], {queryParams: {data: queryParams}});
  }

}
