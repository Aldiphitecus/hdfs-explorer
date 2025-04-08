import React, { useState } from "react";
import { Folder, EllipsisVertical, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { truncate } from "@/lib/utils";
import { usePath } from "@/context/path";
import DeleteDialog from "./deleteDialog";
import toast from "react-hot-toast";

type FolderComponentProps = {
  name: string;
  owner: string;
  type: string;
  modificationTime: number;
};

const FolderComponent: React.FC<FolderComponentProps> = ({ name, owner, type, modificationTime }) => {
  const { navigateTo, joinPath } = usePath();
  const [showInfo, setShowInfo] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newName, setNewName] = useState(name);
  const baseUrl = import.meta.env.VITE_WEBHDFS_URL;
  const hadoopUsername = import.meta.env.VITE_HDFS_USER;

  const handleClick = () => {
    navigateTo(joinPath(name));
  };

  const handleShowInfo = () => {
    setShowInfo(true);
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/${name}?op=DELETE&recursive=true&user.name=${hadoopUsername}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete folder");
      }
      toast.success("File deleted successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2650);
    } catch (e) {
      console.error(e);
      alert("Failed to delete folder.");
    }
  };

  const handleRename = async () => {
    if (!newName || newName === name) return;

    try {
      const response = await fetch(
        `${baseUrl}/${name}?op=RENAME&destination=/${newName}&user.name=${hadoopUsername}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) throw new Error("Rename failed");

      toast.success("Folder renamed successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2650);
    } catch (e) {
      console.error(e);
      toast.error("Failed to rename folder");
    } finally {
      setShowRenameDialog(false);
    }
  };

  return (
    <>
      <div
        className="flex items-center p-4 rounded-2xl bg-gray-100 justify-between hover:bg-gray-200"
        onDoubleClick={handleClick}
      >
        <Folder color="#3e9392" fill="black" />
        <p>{truncate(name, 13)}</p>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 rounded-full hover:bg-gray-300 cursor-pointer">
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem onSelect={handleClick}>Open Folder</DropdownMenuItem>
            <DropdownMenuItem onSelect={handleShowInfo}>Info</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowRenameDialog(true)}>Rename</DropdownMenuItem>
            <DeleteDialog itemName={name} onDelete={handleDelete}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Delete
              </DropdownMenuItem>
            </DeleteDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* info folder */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg border-l z-50 p-4 transform transition-transform duration-300 ${showInfo ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Folder Detail</h2>
          <button className="cursor-pointer" onClick={handleCloseInfo}>
            <X />
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <p className="font-medium">Folder name</p>
            <p>{name}</p>
          </div>
          <div>
            <p className="font-medium">Owner</p>
            <p>{owner}</p>
          </div>
          <div>
            <p className="font-medium">Type</p>
            <p>{type === 'DIRECTORY' || type === 'ALL' ? 'Folder' : 'File'}</p>
          </div>
          <div>
            <p className="font-medium">Modified</p>
            <p>{new Date(modificationTime).toLocaleString("en-EN", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}</p>
          </div>
        </div>
      </div>

      {/* Rename Dialog */}
      <AlertDialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new name for this folder.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <input
            type="text"
            className="w-full border p-2 rounded-md"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRename}>Rename</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FolderComponent;