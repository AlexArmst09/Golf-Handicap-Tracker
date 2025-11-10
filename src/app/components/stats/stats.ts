import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RoundsService } from '../../services/rounds';
import { HandicapService } from '../../services/handicap';
import { GolfRound } from '../../models/round.model';

interface Statistics {
  totalRounds: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  averageDifferential: number;
  bestDifferential: number;
  recentTrend: 'improving' | 'declining' | 'stable';
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './stats.html',
  styleUrls: ['./stats.css']
})
export class StatsComponent implements OnInit {
  stats: Statistics | null = null;
  rounds: GolfRound[] = [];
  handicapValue: number | null = null;

  constructor(
    private roundsService: RoundsService,
    private handicapService: HandicapService
  ) {}

  ngOnInit(): void {
    this.roundsService.rounds$.subscribe(rounds => {
      this.rounds = rounds;
      this.stats = this.handicapService.getStatistics(rounds);
      
      const handicap = this.handicapService.calculateHandicapIndex(rounds);
      this.handicapValue = handicap ? handicap.value : null;
    });
  }

  getTrendIcon(): string {
    if (!this.stats) return 'trending_flat';
    switch (this.stats.recentTrend) {
      case 'improving': return 'trending_down';
      case 'declining': return 'trending_up';
      default: return 'trending_flat';
    }
  }

  getTrendColor(): string {
    if (!this.stats) return '';
    switch (this.stats.recentTrend) {
      case 'improving': return 'trend-improving';
      case 'declining': return 'trend-declining';
      default: return 'trend-stable';
    }
  }

  getTrendText(): string {
    if (!this.stats) return 'Not enough data';
    switch (this.stats.recentTrend) {
      case 'improving': return 'Improving';
      case 'declining': return 'Declining';
      default: return 'Stable';
    }
  }

  getScoresByMonth(): { month: string; avgScore: number; rounds: number }[] {
    if (this.rounds.length === 0) return [];

    const monthMap = new Map<string, { total: number; count: number }>();
    
    this.rounds.forEach(round => {
      const date = new Date(round.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { total: 0, count: 0 });
      }
      
      const data = monthMap.get(monthKey)!;
      data.total += round.score;
      data.count += 1;
    });

    return Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month: this.formatMonthYear(month),
        avgScore: Math.round(data.total / data.count * 10) / 10,
        rounds: data.count
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months
  }

  private formatMonthYear(monthKey: string): string {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}