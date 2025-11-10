import { Injectable } from '@angular/core';
import { GolfRound, HandicapIndex } from '../models/round.model';

@Injectable({
  providedIn: 'root'
})
export class HandicapService {

  constructor() {}

  /**
   * Calculate the handicap differential for a round
   * Formula: (113 / Slope Rating) × (Adjusted Gross Score - Course Rating)
   */
  calculateDifferential(round: GolfRound): number {
    let adjustedScore = round.adjustedScore || round.score;
    let courseRating = round.courseRating;
    
    // For 9-hole rounds, convert to 18-hole equivalent BEFORE calculating differential
    if (round.numberOfHoles === 9) {
      adjustedScore = adjustedScore * 2;
      courseRating = courseRating * 2;
    }
    
    // Calculate differential using 18-hole equivalent values
    const differential = (113 / round.slopeRating) * (adjustedScore - courseRating);
    
    return differential;
}

  /**
   * Calculate Handicap Index from rounds
   * Uses the best differentials based on number of rounds
   */
  calculateHandicapIndex(rounds: GolfRound[]): HandicapIndex | null {
    if (rounds.length < 3) {
      return null; // Need at least 3 rounds
    }

    // Calculate differentials for all rounds
    const differentials = rounds.map(round => ({
      differential: this.calculateDifferential(round),
      round
    })).sort((a, b) => a.differential - b.differential);

    // Determine how many rounds to use based on total rounds
    const numRoundsToUse = this.getNumberOfRoundsToUse(rounds.length);
    
    // Take the best differentials
    const bestDifferentials = differentials.slice(0, numRoundsToUse);
    
    // Calculate average of best differentials
    const average = bestDifferentials.reduce((sum, d) => sum + d.differential, 0) / numRoundsToUse;
    
    // Handicap Index is 96% of average (rounded to one decimal)
    const handicapIndex = Math.round(average * 0.96 * 10) / 10;

    return {
      value: handicapIndex,
      lastUpdated: new Date(),
      roundsUsed: numRoundsToUse
    };
  }

  /**
   * Determine how many best differentials to use based on total rounds
   */
  private getNumberOfRoundsToUse(totalRounds: number): number {
    if (totalRounds >= 20) return 8;
    if (totalRounds >= 19) return 7;
    if (totalRounds >= 16) return 6;
    if (totalRounds >= 12) return 5;
    if (totalRounds >= 9) return 4;
    if (totalRounds >= 6) return 3;
    if (totalRounds >= 5) return 2;
    if (totalRounds >= 3) return 1;
    return 0;
  }

  /**
   * Get statistics from rounds
   */
  getStatistics(rounds: GolfRound[]) {
    if (rounds.length === 0) {
      return null;
    }

    const scores = rounds.map(r => r.score);
    const differentials = rounds.map(r => this.calculateDifferential(r));

    return {
      totalRounds: rounds.length,
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10,
      bestScore: Math.min(...scores),
      worstScore: Math.max(...scores),
      averageDifferential: Math.round(differentials.reduce((a, b) => a + b, 0) / differentials.length * 10) / 10,
      bestDifferential: Math.round(Math.min(...differentials) * 10) / 10,
      recentTrend: this.calculateTrend(rounds.slice(0, 5))
    };
  }

  /**
   * Calculate scoring trend (improving, declining, stable)
   */
  private calculateTrend(recentRounds: GolfRound[]): 'improving' | 'declining' | 'stable' {
    if (recentRounds.length < 3) return 'stable';

    const oldAvg = recentRounds.slice(-3).reduce((sum, r) => sum + r.score, 0) / 3;
    const newAvg = recentRounds.slice(0, 3).reduce((sum, r) => sum + r.score, 0) / 3;
    
    const difference = oldAvg - newAvg;
    
    if (difference > 1) return 'improving';
    if (difference < -1) return 'declining';
    return 'stable';
  }
}