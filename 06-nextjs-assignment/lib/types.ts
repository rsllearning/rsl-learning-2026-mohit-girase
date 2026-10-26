export type ProjectStatus = 'active' | 'in-progress' | 'completed' | 'on-hold' | 'planning';

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  department: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: PriorityLevel;
  dueDate: string;
  assignedTo: string; // Member name or ID
}

export interface ProjectActivity {
  id: string;
  timestamp: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  details?: string;
}

export interface ProjectDoc {
  slug: string[]; // e.g. ["setup"], ["setup", "database"]
  title: string;
  category: string;
  summary: string;
  content: string; // Markdown or rich text
  lastUpdated: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: PriorityLevel;
  category: string;
  progress: number; // 0 to 100
  startDate: string;
  targetDate: string;
  budget: string;
  spent: string;
  lead: TeamMember;
  team: TeamMember[];
  tasks: ProjectTask[];
  activities: ProjectActivity[];
  docs: ProjectDoc[];
  technologies: string[];
}
