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
    if(this.personObj){
      this.calculateAgeOrPregnancy(this.personObj.dateOfBirth);
    }
  }

  private calculateAgeOrPregnancy(dateString: string): void {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay; // Aproksimacija

    if (givenDate > currentDate) {
      // Datum je u budućnosti, izračunavamo broj nedelja trudnoće
      const weeksPregnant = Math.floor((givenDate.getTime() - currentDate.getTime()) / oneWeek);
      this.message = `${weeksPregnant} nedelja trudnaoce`;
    } else {
      // Izračunavamo starost u mesecima ako je osoba mlađa od godinu dana
      const monthsOld = Math.floor((currentDate.getTime() - givenDate.getTime()) / oneMonth);
      if (monthsOld < 12) {
        this.message = `${monthsOld} meseci`;
      } else {
        // Izračunavamo starost u godinama ako je osoba starija od godinu dana
        const ageYears = currentDate.getFullYear() - givenDate.getFullYear();
        this.message = `${ageYears} godina`;
      }
    }
  }


  goTo() {
    console.log('childobj', this.personObj)
    const queryParams = encodeURIComponent(JSON.stringify(this.personObj));
    this.router.navigate(['home/profile/profile-details'], {queryParams: {data: queryParams}});
  }

}
