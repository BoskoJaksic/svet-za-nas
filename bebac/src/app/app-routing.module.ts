import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login-register',
    loadChildren: () => import('./pages/login-register/login-register.module').then(m => m.LoginRegisterPageModule)
  },
  {
    path: '',
    redirectTo: 'login-register',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
