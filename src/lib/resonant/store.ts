import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Level, QuestionResult } from "./types";

interface SessionState {
  userName: string;
  level: Level | null;
  currentQuestion: number; // 0-indexed
  results: QuestionResult[];
  completedLevels: Level[];

  setName: (name: string) => void;
  setLevel: (level: Level) => void;
  setCurrentQuestion: (i: number) => void;
  pushResult: (r: QuestionResult) => void;
  completeLevel: (l: Level) => void;
  resetProgress: () => void;
  resetAll: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      userName: "",
      level: null,
      currentQuestion: 0,
      results: [],
      completedLevels: [],
      setName: (userName) => set({ userName }),
      setLevel: (level) =>
        set((s) => ({
          level,
          currentQuestion: 0,
          results: [],
          completedLevels: s.completedLevels.filter((l) => l !== level),
        })),
      setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
      pushResult: (r) =>
        set((s) => {
          const without = s.results.filter((x) => x.questionId !== r.questionId);
          return { results: [...without, r] };
        }),
      completeLevel: (l) =>
        set((s) => ({
          completedLevels: s.completedLevels.includes(l)
            ? s.completedLevels
            : [...s.completedLevels, l],
        })),
      resetProgress: () =>
        set((s) => ({
          currentQuestion: 0,
          results: [],
          completedLevels: s.level
            ? s.completedLevels.filter((l) => l !== s.level)
            : s.completedLevels,
        })),
      resetAll: () =>
        set({ userName: "", level: null, currentQuestion: 0, results: [], completedLevels: [] }),
    }),
    {
      name: "resonant-session",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage),
      ),
    },
  ),
);
