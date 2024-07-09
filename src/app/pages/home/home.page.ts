import { Component, OnInit } from '@angular/core';
import { SideBarModel } from '../../models/sideBar.model';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute } from '@angular/router';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { AlertController, isPlatform, Platform } from '@ionic/angular';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';
import { UserService } from 'src/app/common/services/user.service';
import { PushNotificationsService } from 'src/app/common/services/push-notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  filteredSidebarsUrl: SideBarModel[] = [];
  sidebarsUrl: SideBarModel[] = [
    {
      pageUrl: 'in-app-browser',
      name: 'Naš Svet',
      iconSrc: 'people-outline',
    },
    {
      pageUrl: 'profile',
      name: 'Profil',
      iconSrc: 'person-outline',
    },
    {
      pageUrl: 'users',
      name: 'Korisnici',
      iconSrc: 'people-outline',
    },
    {
      pageUrl: 'settings',
      name: 'Podešavanja',
      iconSrc: 'settings-outline',
    },
  ];
  constructor(
    private route: ActivatedRoute,
    private platform: Platform,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private pushNotificationsService: PushNotificationsService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.filterSidebars();
      if (this.platform.is('android') || this.platform.is('ios')) {
        this.initializePushNotifications();
      }
    });
  }

  filterSidebars() {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userRole = decodedToken.role;
        if (userRole == 'Admin') {
          this.filteredSidebarsUrl = this.sidebarsUrl;
        } else if (userRole == 'Guest') {
          this.filteredSidebarsUrl = this.sidebarsUrl.filter(
            (item) => item.pageUrl === 'in-app-browser'
          );
        } else {
          this.filteredSidebarsUrl = this.sidebarsUrl.filter(
            (item) => item.pageUrl !== 'users'
          );
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    } else {
      this.filteredSidebarsUrl = this.sidebarsUrl.filter(
        (item) => item.pageUrl !== 'users'
      );
    }
  }

  initializePushNotifications() {
    PushNotifications.requestPermissions().then((result: any) => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });
    PushNotifications.addListener('registration', (token: Token) => {
      let registrationToken = token.value;
      if (registrationToken != null && registrationToken != 'null') {
        var deviceType = 'Web';
        if (this.platform.is('android')) {
          deviceType = 'Android';
        } else if (this.platform.is('ios')) {
          deviceType = 'IOS';
        }

        var pushNotificationsDetail = {
          email: this.localStorageService.getUserEmail(),
          deviceId: registrationToken,
          deviceType: deviceType,
        };

        this.pushNotificationsService
          .addPushNotificationDevice(pushNotificationsDetail)
          .subscribe(
            async (data: any) => {
              console.log('Push Notification Device Added');
            },
            async (error: any) => {}
          );
      }
    });

    PushNotifications.addListener('registrationError', (error: any) => {});

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        this.showPushNotificationAlert(notification);
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (args: ActionPerformed) => {
        const url = args.notification.data.url;
        if (url) {
          window.open(url, '_blank');
        }
      }
    );
  }

  async showPushNotificationAlert(notificationDetail: any) {
    const alert = await this.alertCtrl.create({
      header: notificationDetail.title,
      message: notificationDetail.body,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
        {
          text: 'Otvori link',
          handler: () => {
            const url = notificationDetail.data.url;
            if (url) {
              window.open(url, '_blank');
            }
          },
        },
      ],
    });
    await alert.present();
  }
}
