import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  constructor(private apiService: ApiService) {}

  addPet(obj: any) {
    return this.apiService.post('Pets/AddPet', obj);
  }

  deletePet(obj: any) {
    return this.apiService.delete('Pets/DeletePet', obj);
  }
}
