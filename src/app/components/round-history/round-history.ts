import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RoundsService } from '../../services/rounds';
import { HandicapService } from '../../services/handicap';
import { GolfRound } from '../../models/round.model';

@Component({
  selector: 'app-round-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './round-history.html',
  styleUrls: ['./round-history.css']
})
export class RoundHistoryComponent implements OnInit {
  rounds: GolfRound[] = [];
  displayedColumns: string[] = ['date', 'courseName', 'score', 'courseRating', 'slopeRating', 'differential', 'actions'];

  constructor(
    private roundsService: RoundsService,
    private handicapService: HandicapService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.roundsService.rounds$.subscribe(rounds => {
      this.rounds = rounds;
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getDifferential(round: GolfRound): number {
    return Math.round(this.handicapService.calculateDifferential(round) * 10) / 10;
  }

  deleteRound(round: GolfRound): void {
    if (confirm(`Are you sure you want to delete the round at ${round.courseName}?`)) {
      this.roundsService.deleteRound(round.id);
      this.snackBar.open('Round deleted successfully', 'Close', {
        duration: 3000
      });
    }
  }

  clearAllRounds(): void {
    if (confirm('Are you sure you want to delete ALL rounds? This cannot be undone!')) {
      this.roundsService.clearAllRounds();
      this.snackBar.open('All rounds cleared', 'Close', {
        duration: 3000
      });
    }
  }
}