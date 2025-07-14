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
    path: 'instruction',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/instruction/instruction.component').then(
        (c) => c.InstructionComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'landing',
  },
];
