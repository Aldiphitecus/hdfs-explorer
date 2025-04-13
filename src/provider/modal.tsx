import { ReactNode, useState } from "react";
import { ModalContext } from "@/context/modal";
import {ModalType, FileInfo} from "@/type"

interface ModalProviderProps {
    children: ReactNode;
  }
  
  export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [modalType, setModalType] = useState<ModalType>(null);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  
    const openInfoModal = (info: FileInfo) => {
      setModalType("info");
      setFileInfo(info);
    };
  
    const openRenameModal = (info: FileInfo) => {
      setModalType("rename");
      setFileInfo(info);
    };
  
    const openDeleteModal = (info: FileInfo) => {
      setModalType("delete");
      setFileInfo(info);
    };
  
    const closeModal = () => {
      setModalType(null);
      setFileInfo(null);
    };
  
    return (
      <ModalContext.Provider
        value={{
          modalType,
          fileInfo,
          openInfoModal,
          openRenameModal,
          openDeleteModal,
          closeModal,
        }}
      >
        {children}
      </ModalContext.Provider>
    );
  };