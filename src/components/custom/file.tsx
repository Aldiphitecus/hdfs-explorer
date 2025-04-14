import React from "react";
import { Info, Pencil, Trash2, Download } from "lucide-react";
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
import { truncate, getExtension, axiosInstance } from "@/lib/utils";
import { fileIcon } from "@/constant";

type FileComponentProps = FileInfo;

const FileComponent: React.FC<FileComponentProps> = ({
  name,
  owner,
  type,
  size,
  modificationTime,
}) => {
  const { openInfoModal, openRenameModal, openDeleteModal } = useModal();
  const { joinPath } = usePath();
  const handleInfo = () => {
    openInfoModal({ name, owner, type, modificationTime, size });
  };

  const handleRename = () => {
    openRenameModal({ name, owner, type, modificationTime, size });
  };

  const handleDelete = () => {
    openDeleteModal({ name, owner, type, modificationTime, size });
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(`/file`, {
        params: { path: joinPath(name) },
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const getFileIcon = () => {
    const extension = getExtension(name)?.toLowerCase();
    if (!extension) return <div className="w-6 h-6 bg-gray-200 rounded" />;

    for (const [iconPath, extensions] of Object.entries(fileIcon)) {
      if (extensions.includes(extension)) {
        return <img src={iconPath} alt={extension} className="w-16 h-16" />;
      }
    }

    return <div className="w-6 h-6 bg-gray-200 rounded" />;
  };

  return (
    <>
      <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow relative">
        <div className="flex flex-col items-center text-center">
          <div className="text-blue-500 mb-2">{getFileIcon()}</div>

          <>
            <div className="font-medium text-gray-800 truncate">
              {truncate(name, 13)}
            </div>
            <div className="text-xs text-gray-500 truncate">{size}</div>
          </>
        </div>

        <div className="absolute top-2 right-2 flex gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="text-gray-500 hover:text-blue-600 cursor-pointer">
              <EllipsisVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer" onSelect={handleDownload}>
                <Download color="green"/>
                <span>Download</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={handleInfo}
              >
                <Info color="blue" />
                <span>Info</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={handleRename}
              >
                <Pencil color="yellow" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={handleDelete}
              >
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

export default FileComponent;
