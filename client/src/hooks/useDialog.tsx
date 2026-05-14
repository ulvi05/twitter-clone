import { create } from "zustand";

export enum ModalTypeEnum {
  COMMENT = "comment",
}

interface DialogState {
  type: ModalTypeEnum | null;
  isOpen: boolean;
  postId: string | null;
  openDialog: (type: ModalTypeEnum, postId: string) => void;
  closeDialog: () => void;
}

export const useDialog = create<DialogState>((set) => ({
  type: null,
  isOpen: false,
  postId: null,
  openDialog: (type: ModalTypeEnum, postId: string) =>
    set({ type, isOpen: true, postId }),
  closeDialog: () => set({ isOpen: false, type: null, postId: null }),
}));
