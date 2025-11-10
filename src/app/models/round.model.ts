export interface GolfRound {
  id: string;
  date: Date;
  courseName: string;
  courseRating: number;
  slopeRating: number;
  score: number;
  adjustedScore?: number;
  differentials?: number;
  teeColor?: string;
  numberOfHoles: 9 | 18;
  weather?: string;
  notes?: string;
}

export interface HandicapIndex {
  value: number;
  lastUpdated: Date;
  roundsUsed: number;
}
