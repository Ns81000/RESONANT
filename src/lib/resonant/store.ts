import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Level, QuestionResult } from "./types";

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
  const without = list.filter((x) => x.questionId !== r.questionId);
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
          return {
            level,
            currentQuestion: 0,
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
