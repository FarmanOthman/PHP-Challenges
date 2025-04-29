export interface Task {
  id: number;
  title: string;
  description: string;
  due_date?: string;
  category?: string;
  status: 'pending' | 'in_progress' | 'completed';
  is_important: boolean;
  priority?: 'low' | 'medium' | 'high'; // For backward compatibility with UI components
  created_at: string;
  updated_at: string;
  user_id: number;
}