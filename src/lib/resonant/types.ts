export type Level = "beginner" | "intermediate" | "advanced";

export interface Question {
  id: string;
  level: Level;
  category: string;
  prompt: string;
  timeLimitSeconds: number;
  providedText: string | null;
}

export interface FeedbackItem {
  type: "grammar" | "clarity" | "vocabulary" | "filler";
  issue: string;
  fix: string;
}

export interface Scores {
  clarity: number;
  grammar: number;
  confidence: number;
}

export interface EvaluationResponse {
  transcript: string;
  scores: Scores;
  feedbackItems: FeedbackItem[];
  coachNote: string;
  passed: boolean;
}

export interface QuestionResult {
  questionId: string;
  attempts: number;
  bestScores: Scores;
  passed: boolean;
  skipped?: boolean;
}
