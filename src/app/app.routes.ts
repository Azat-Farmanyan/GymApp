import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'landing',
  },
  {
    path: 'landing',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/landing/landing.component').then(
        (c) => c.LandingComponent
      ),
  },

  {
    path: 'gym',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/gym/gym.component').then((c) => c.GymComponent),
  },
  {
    path: '**',
    redirectTo: 'landing',
  },
];
