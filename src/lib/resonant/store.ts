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
      skipped: r.skipped !== undefined ? r.skipped : !!existing.skipped,
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
            const questions = questionsForLevel(level);
            const allQuestionsHaveResult = questions.every((q) =>
              s.results.some((res) => res.questionId === q.id)
            );
            if (allQuestionsHaveResult) {
              const firstIncompleteIndex = questions.findIndex((q) => {
                const r = s.results.find((res) => res.questionId === q.id);
                return !r || !r.passed;
              });
              const currentQuestion = firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0;
              return { currentQuestion };
            }
            return {};
          }
          const allResults = { ...s.allResults };
          if (s.level && s.results.length > 0) {
            allResults[s.level] = s.results;
          }
          const restored = allResults[level] ?? [];
          const questions = questionsForLevel(level);
          const firstIncompleteIndex = questions.findIndex((q) => {
            const r = restored.find((res) => res.questionId === q.id);
            return !r || !r.passed;
          });
          const currentQuestion = firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0;
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
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Sanitize results
          state.results = state.results.map((r) => ({
            ...r,
            attempts: r.attempts > 100 ? 1 : r.attempts,
          }));

          // Sanitize allResults
          const sanitizedAll: AllResults = {};
          for (const key of Object.keys(state.allResults) as Level[]) {
            const list = state.allResults[key];
            if (list) {
              sanitizedAll[key] = list.map((r) => ({
                ...r,
                attempts: r.attempts > 100 ? 1 : r.attempts,
              }));
            }
          }
          state.allResults = sanitizedAll;
        }
      },
    },
  ),
);
