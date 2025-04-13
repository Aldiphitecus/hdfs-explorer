import React from "react";
import { Info, Pencil, Trash2, LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { usePath } from "@/context/path";
import { useModal } from "@/context/modal";
import { FileInfo } from "@/type";
import { truncate } from "@/lib/utils";

type FolderComponentProps = FileInfo;

const FolderComponent: React.FC<FolderComponentProps> = ({
  name,
  owner,
  type,
  modificationTime,
}) => {
  const { navigateTo, joinPath } = usePath();
  const {openInfoModal, openRenameModal, openDeleteModal} = useModal()

  const handleClick = () => {
    navigateTo(joinPath(name));
  };

  const handleInfo = () => {
    openInfoModal({ name, owner, type, modificationTime });
  };

  const handleRename = () => {
    openRenameModal({ name, owner, type, modificationTime });
  }

  const handleDelete = () => {
    openDeleteModal({ name, owner, type, modificationTime });
  }

  return (
    <>
      <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow relative">
        <div
          onClick={handleClick}
          className="flex flex-col items-center text-center"
        >
          <div className="text-blue-500 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7h4l2 2h10a1 1 0 011 1v7a1 1 0 01-1 1H3V7z"
              />
            </svg>
          </div>

          <>
            <div className="font-medium text-gray-800 truncate">{truncate(name, 13)}</div>
            <div className="text-xs text-gray-500 truncate">{owner}</div>
          </>
        </div>

        <div className="absolute top-2 right-2 flex gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="text-gray-500 hover:text-blue-600 cursor-pointer">
              <EllipsisVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer">
                <LogIn color="green"/>
                <span>Open Folder</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onSelect={handleInfo}>
                <Info color="blue"/>
                <span>Info</span>
              </DropdownMenuItem>
              <DropdownMenuItem  className="cursor-pointer" onSelect={handleRename}>
                <Pencil color="yellow" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onSelect={handleDelete}>
                <Trash2 color="red" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default FolderComponent;
