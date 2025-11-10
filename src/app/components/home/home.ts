import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RoundsService } from '../../services/rounds';
import { HandicapService } from '../../services/handicap';
import { GolfRound, HandicapIndex } from '../../models/round.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  handicapIndex: HandicapIndex | null = null;
  recentRounds: GolfRound[] = [];
  totalRounds: number = 0;

  constructor(
    private roundsService: RoundsService,
    private handicapService: HandicapService
  ) {}

  ngOnInit(): void {
    this.roundsService.rounds$.subscribe(rounds => {
      this.totalRounds = rounds.length;
      this.recentRounds = rounds.slice(0, 5);
      this.handicapIndex = this.handicapService.calculateHandicapIndex(rounds);
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}