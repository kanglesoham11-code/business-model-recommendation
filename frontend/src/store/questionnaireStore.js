import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useQuestionnaireStore = create(
  persist(
    (set) => ({
      currentStep: 0,
      questionnaireId: null,
      answers: {},
      
      setStep: (step) => set({ currentStep: step }),
      
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      
      prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
      
      setQuestionnaireId: (id) => set({ questionnaireId: id }),
      
      updateAnswers: (newAnswers) => set((state) => ({
        answers: { ...state.answers, ...newAnswers }
      })),
      
      reset: () => set({
        currentStep: 0,
        questionnaireId: null,
        answers: {}
      }),
    }),
    {
      name: 'questionnaire-storage',
    }
  )
);
