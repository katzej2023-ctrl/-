export type TaskType = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export enum AppStage {
  WELCOME = 'WELCOME',
  SELECTION = 'SELECTION',
  TASK_CARD = 'TASK_CARD',
  PREPARATION = 'PREPARATION',
  SPEAKING = 'SPEAKING',
  ANALYSIS = 'ANALYSIS',
  FEEDBACK = 'FEEDBACK',
}

export interface TaskConfig {
  id: TaskType;
  title: string;
  description: string;
  prepTimeSeconds: number;
  speakTimeSeconds: number;
  context: string; // "Sie" or "Du"
  interlocutor: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number; // For comparative charts
}

export interface GeneratedTaskContent {
  germanTitle: string;
  germanTaskText: string;
  chineseInstructions: string;
  chartData?: ChartDataPoint[]; // Only for Task 3 & 6
  chartTitle?: string;
  openingLineHint: string;
}

export interface FeedbackData {
  markdownAnalysis: string;
}