import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-custom-stepper',
  templateUrl: './custom-stepper.component.html',
  styleUrls: ['./custom-stepper.component.scss'],
})
export class CustomStepperComponent  implements OnInit {
  @Input() currentStep!: number;
  @Input() stepCompleted!: boolean[];

  constructor() { }

  ngOnInit() {}

}
