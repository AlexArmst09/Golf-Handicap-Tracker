import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AddRoundComponent } from './components/add-round/add-round';
import { RoundHistoryComponent } from './components/round-history/round-history';
import { StatsComponent } from './components/stats/stats';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add-round', component: AddRoundComponent },
  { path: 'history', component: RoundHistoryComponent },
  { path: 'stats', component: StatsComponent },
  { path: '**', redirectTo: '' }
];