// storeimage.ts
import { create } from "zustand";

interface ImageStore {
  file: File | null
  processed: string | null;
  setFile: (file: File) => void
  setProcessed: (image: string | null) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  file: null,
  processed: null,
  setFile: (file) => set({ file }),
  setProcessed: (image) => set({ processed: image }),
}));
