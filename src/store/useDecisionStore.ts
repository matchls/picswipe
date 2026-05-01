import { create } from "zustand";

type DecisionStore = {
  toKeep: string[];
  toDelete: string[];
  addKeep: (id: string) => void;
  addDelete: (id: string) => void;
};

const useDecisionStore = create<DecisionStore>()((set) => ({
  toKeep: [],
  toDelete: [],
  addKeep: (id) => set((state) => ({ toKeep: [...state.toKeep, id] })),
  addDelete: (id) => set((state) => ({ toDelete: [...state.toDelete, id] })),
}));

export default useDecisionStore;
