import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class ToasterService {
  backgroundColor: string = ''

  constructor(private toastController: ToastController) {
  }

  public toastButtons = [
    {
      text: 'Ukloni',
      role: 'cancel',
    },
  ];

  async presentToast(message: any, type: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: "bottom",
      buttons: this.toastButtons,
      mode: 'ios',
      cssClass: 'custom-toast'
    });
    if (type === 'success') {
      this.backgroundColor = 'var(--ion-color-success)'
    } else if (type === 'danger') {
      this.backgroundColor = 'var(--ion-color-danger)'
    } else if (type === 'warning') {
      this.backgroundColor = 'var(--ion-color-warning)'
    }
    toast.style.setProperty('--background', this.backgroundColor);
    await toast.present();
  }
}
