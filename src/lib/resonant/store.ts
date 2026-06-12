import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Level, QuestionResult } from "./types";
import { questionsForLevel } from "./questions";

type AllResults = Partial<Record<Level, QuestionResult[]>>;

interface SessionState {
  userName: string;
  level: Level | null;
  currentQuestion: number; // 0-indexed
  results: QuestionResult[];
  completedLevels: Level[];
  allResults: AllResults;

  setName: (name: string) => void;
  setLevel: (level: Level) => void;
  setCurrentQuestion: (i: number) => void;
  pushResult: (r: QuestionResult) => void;
  completeLevel: (l: Level) => void;
  resetProgress: () => void;
  resetAll: () => void;
}

const upsertResult = (list: QuestionResult[], r: QuestionResult): QuestionResult[] => {
  const existing = list.find((x) => x.questionId === r.questionId);
  const without = list.filter((x) => x.questionId !== r.questionId);
  if (existing) {
    const merged: QuestionResult = {
      questionId: r.questionId,
      attempts: existing.attempts + r.attempts,
      bestScores: {
        clarity: Math.max(existing.bestScores.clarity, r.bestScores.clarity),
        grammar: Math.max(existing.bestScores.grammar, r.bestScores.grammar),
        confidence: Math.max(existing.bestScores.confidence, r.bestScores.confidence),
      },
      passed: existing.passed || r.passed,
      skipped: r.skipped !== undefined ? (r.skipped && !!existing.skipped) : !!existing.skipped,
    };
    return [...without, merged];
  }
  return [...without, r];
};

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      userName: "",
      level: null,
      currentQuestion: 0,
      results: [],
      completedLevels: [],
      allResults: {},
      setName: (userName) => set({ userName }),
      setLevel: (level) =>
        set((s) => {
          if (s.level === level) {
            return {};
          }
          const allResults = { ...s.allResults };
          if (s.level && s.results.length > 0) {
            const existing = allResults[s.level] ?? [];
            let merged = [...existing];
            for (const r of s.results) {
              merged = upsertResult(merged, r);
            }
            allResults[s.level] = merged;
          }
          const restored = allResults[level] ?? [];
          const questions = questionsForLevel(level);
          const firstUnansweredIndex = questions.findIndex(
            (q) => !restored.some((r) => r.questionId === q.id)
          );
          const currentQuestion = firstUnansweredIndex !== -1 ? firstUnansweredIndex : 0;
          return {
            level,
            currentQuestion,
            results: restored,
            allResults,
          };
        }),
      setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
      pushResult: (r) =>
        set((s) => {
          const results = upsertResult(s.results, r);
          const allResults = { ...s.allResults };
          if (s.level) {
            allResults[s.level] = upsertResult(allResults[s.level] ?? [], r);
          }
          return { results, allResults };
        }),
      completeLevel: (l) =>
        set((s) => ({
          completedLevels: s.completedLevels.includes(l)
            ? s.completedLevels
            : [...s.completedLevels, l],
        })),
      resetProgress: () =>
        set((s) => {
          const allResults = { ...s.allResults };
          if (s.level) {
            delete allResults[s.level];
          }
          return {
            currentQuestion: 0,
            results: [],
            allResults,
            completedLevels: s.level
              ? s.completedLevels.filter((l) => l !== s.level)
              : s.completedLevels,
          };
        }),
      resetAll: () =>
        set({
          userName: "",
          level: null,
          currentQuestion: 0,
          results: [],
          completedLevels: [],
          allResults: {},
        }),
    }),
    {
      name: "resonant-session",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage),
      ),
    },
  ),
);
