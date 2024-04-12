import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomePage} from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: "full",
        data: {
          title: 'Profil',
        }
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule),
        data: {
          title: 'Profil',
        }
      },
      {
        path: 'in-app-browser',
        loadChildren: () => import('./in-app-browser/in-app-browser.module').then(m => m.InAppBrowserPageModule),
        data: {
          title: 'Naš Svet',
        }
      },

      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule),
        data: {
          title: 'Podešavanja',
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {
}
