import { createContext, useContext } from "react";
import { FileInfo, ModalType } from "@/type";

interface ModalContextType {
  modalType: ModalType;
  fileInfo: FileInfo | null;
  
  openInfoModal: (fileInfo: FileInfo) => void;
  openRenameModal: (fileInfo: FileInfo) => void;
  openDeleteModal: (fileInfo: FileInfo) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};