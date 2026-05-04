import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type PhotoDecision = { id: string; uri: string };
type DecisionStore = {
  toKeep: PhotoDecision[];
  toDelete: PhotoDecision[];
  addKeep: (photo: PhotoDecision) => void;
  addDelete: (photo: PhotoDecision) => void;
  clearDelete: () => void;
  removeFromDelete: (id: string) => void;
  deletedCount: number;
  deletedSize: number;
  addDeletedStats: (count: number, size: number) => void;
};

const useDecisionStore = create<DecisionStore>()(
  persist(
    (set) => ({
      toKeep: [],
      toDelete: [],
      addKeep: (photo) =>
        set((state) => ({ toKeep: [...state.toKeep, photo] })),
      addDelete: (photo) =>
        set((state) => ({ toDelete: [...state.toDelete, photo] })),
      clearDelete: () => set({ toDelete: [] }),
      removeFromDelete: (id) =>
        set((state) => ({
          toDelete: state.toDelete.filter((p) => p.id !== id),
        })),
      deletedCount: 0,
      deletedSize: 0,
      addDeletedStats: (count, size) =>
        set((state) => ({
          deletedCount: state.deletedCount + count,
          deletedSize: state.deletedSize + size,
        })),
    }),
    {
      name: "decision-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useDecisionStore;
