export interface RepairSession {
  id: string;
  created_at?: string;
  session_id: string;
  repair_mode: string;
  characters: number;
  words: number;
  processing_time: number;
  problems_found: number;
  rules_applied: number;
  success: boolean;
  browser?: string;
  device?: string;
}
