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
          title: 'Profile',
        }
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule),
        data: {
          title: 'Profile',
        }
      },
      {
        path: 'in-app-browser',
        loadChildren: () => import('./in-app-browser/in-app-browser.module').then(m => m.InAppBrowserPageModule),
        data: {
          title: 'In App',
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
