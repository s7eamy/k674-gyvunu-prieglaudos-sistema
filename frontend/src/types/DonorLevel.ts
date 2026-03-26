export interface DonorLevel {
  level: number;
  max_level: number;
  total_points: number;
  points_to_next_level: number;
  next_threshold: number | null;
}
