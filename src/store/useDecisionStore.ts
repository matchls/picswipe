import { create } from "zustand";

type PhotoDecision = { id: string; uri: string };
type DecisionStore = {
  toKeep: PhotoDecision[];
  toDelete: PhotoDecision[];
  addKeep: (photo: PhotoDecision) => void;
  addDelete: (photo: PhotoDecision) => void;
  clearDelete: () => void;
};

const useDecisionStore = create<DecisionStore>()((set) => ({
  toKeep: [],
  toDelete: [],
  addKeep: (photo) => set((state) => ({ toKeep: [...state.toKeep, photo] })),
  addDelete: (photo) =>
    set((state) => ({ toDelete: [...state.toDelete, photo] })),
  clearDelete: () => set({ toDelete: [] }),
}));

export default useDecisionStore;
