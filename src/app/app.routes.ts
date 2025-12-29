import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.page').then( m => m.WelcomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'planning',
    loadComponent: () => import('./pages/planning/planning.page').then( m => m.PlanningPage)
  },
  {
    path: 'session/:id',
    loadComponent: () => import('./pages/session/session.page').then( m => m.SessionPage)
  },
  {
    path: 'followup',
    loadComponent: () => import('./pages/followup/followup.page').then( m => m.FollowupPage)
  },
  {
    path: 'session-selection',
    loadComponent: () => import('./pages/session-selection/session-selection.page').then( m => m.SessionSelectionPage)
  },
  {
    path: 'session-start/:id',
    loadComponent: () => import('./pages/session-start/session-start.page').then( m => m.SessionStartPage)
  },
  {
    path: 'session-end/:id',
    loadComponent: () => import('./pages/session-end/session-end.page').then( m => m.SessionEndPage)
  },
];
