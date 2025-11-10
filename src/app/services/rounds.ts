import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GolfRound } from '../models/round.model';

@Injectable({
  providedIn: 'root'
})
export class RoundsService {
  private readonly STORAGE_KEY = 'golf_rounds';
  private roundsSubject = new BehaviorSubject<GolfRound[]>(this.loadRounds());
  public rounds$: Observable<GolfRound[]> = this.roundsSubject.asObservable();

  constructor() {}

  private loadRounds(): GolfRound[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const rounds = JSON.parse(stored);
      return rounds.map((r: any) => ({
        ...r,
        date: new Date(r.date)
      }));
    }
    return [];
  }

  private saveRounds(rounds: GolfRound[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(rounds));
    this.roundsSubject.next(rounds);
  }

  getRounds(): GolfRound[] {
    return this.roundsSubject.value;
  }

  addRound(round: Omit<GolfRound, 'id'>): void {
    const rounds = this.getRounds();
    const newRound: GolfRound = {
      ...round,
      id: this.generateId(),
      date: new Date(round.date)
    };
    rounds.push(newRound);
    rounds.sort((a, b) => b.date.getTime() - a.date.getTime());
    this.saveRounds(rounds);
  }

  updateRound(id: string, round: Partial<GolfRound>): void {
    const rounds = this.getRounds();
    const index = rounds.findIndex(r => r.id === id);
    if (index !== -1) {
      rounds[index] = { ...rounds[index], ...round };
      this.saveRounds(rounds);
    }
  }

  deleteRound(id: string): void {
    const rounds = this.getRounds().filter(r => r.id !== id);
    this.saveRounds(rounds);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  clearAllRounds(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.roundsSubject.next([]);
  }
}