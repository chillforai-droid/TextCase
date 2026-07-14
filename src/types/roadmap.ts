export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "planned" | "in-progress" | "completed";
  version?: string;
  display_order: number;
  created_at?: string;
}
