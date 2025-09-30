import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { UserPreferences, BeachRecommendation } from '@/types'

interface AppStore {
  // User Preferences
  userPreferences: UserPreferences | null
  setUserPreferences: (preferences: UserPreferences) => void

  // Recommendations
  recommendations: BeachRecommendation[]
  setRecommendations: (recommendations: BeachRecommendation[]) => void

  // Selected Beach
  selectedBeach: BeachRecommendation | null
  setSelectedBeach: (beach: BeachRecommendation | null) => void

  // Loading State
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // Onboarding
  hasCompletedOnboarding: boolean
  setHasCompletedOnboarding: (completed: boolean) => void
}

const useStore = create<AppStore>()(
  persist(
    (set) => ({
      // User Preferences
      userPreferences: null,
      setUserPreferences: (preferences) => set({ userPreferences: preferences }),

      // Recommendations
      recommendations: [],
      setRecommendations: (recommendations) => set({ recommendations }),

      // Selected Beach
      selectedBeach: null,
      setSelectedBeach: (beach) => set({ selectedBeach: beach }),

      // Loading State
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Onboarding
      hasCompletedOnboarding: false,
      setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
    }),
    {
      name: 'mywave-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // 임시 상태는 저장하지 않음
      partialize: (state) => ({
        userPreferences: state.userPreferences,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
)

export default useStore