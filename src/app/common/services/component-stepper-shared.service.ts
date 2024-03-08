// shared-data.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentStepperSharedService {
  step1Data: any = {};
  step2Data: any = {};
  step3Data: any = {};
}
