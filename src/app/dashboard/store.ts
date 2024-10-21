import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface DashboardPageState {
  selectedDateHeader?: string;
  currentRange?: { start: Date; end: Date };
  setSelectedDateHeader: (value: string) => void;
  setCurrentRange: (range: { start: Date; end: Date }) => void;
}

export const useDashboardPageStore = create<DashboardPageState>()(
  devtools(
    persist(
      (set) => ({
        setSelectedDateHeader: (value: string) => set(() => ({ selectedDateHeader: value })),
        setCurrentRange: (range) => set(() => ({ currentRange: range })),
      }),
      {
        name: "dashboardPage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
