import { create } from 'zustand'

type StudyState = {
  completedLessons: number
  completeLesson: () => void
}

export const useStudyStore = create<StudyState>((set) => ({
  completedLessons: 0,
  completeLesson: () => set((state) => ({ completedLessons: state.completedLessons + 1 })),
}))
