import { create } from "zustand";

interface ModalState {
    isOpen : boolean;
    openModal : (content : React.ReactNode , title? : string)=>void;
    closeModal : ()=>void;
    title : string;
    content : React.ReactNode
}

export const useModal = create<ModalState>((set) => ({
  isOpen: false,
  title: "",
  content: null,
  openModal: (content, title = "") => set({ isOpen: true, content, title }),
  closeModal: () => set({ isOpen: false, content: null, title: "" }),
}));