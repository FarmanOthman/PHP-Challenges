export interface Task {
  id: number;
  title: string;
  description: string;
  due_date?: string;
  category?: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}