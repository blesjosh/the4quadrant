export interface Task {
  id: number;
  title: string;
  description: string;
  deadline?: Date;
  delegated_to: string; // Changed from delegatedTo to match the database column
  status: string;
  user_id: string;
  created_at?: string;
  last_active_status?: string; // Added to track previous status for completed tasks
}