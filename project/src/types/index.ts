export interface MatchingPair {
  row: string;
  col: string;
  weight: number;
}

export interface MatchingResult {
  pairs: MatchingPair[];
  totalWeight: number;
  matchingType: 'max' | 'min';
  rowLabels: string[];
  colLabels: string[];
}