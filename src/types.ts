export type Streak = {
  id: string;
  name: string;
  frequency: string; // "daily", "3 times a week", etc.
  progress: number; // number of successful check-ins
  goal: number; // target number of check-ins per week
  lastCheckInDate?: string; // date of the last check-in
};
