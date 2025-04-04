import React from "react";
import { Folder, EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { truncate } from "@/lib/utils";

import { usePath } from "@/context/path";

type FolderComponentProps = {
  name: string;
};

const FolderComponent: React.FC<FolderComponentProps> = ({
  name,
}) => {

  const { navigateTo, joinPath } = usePath();

  const handleClick = () => {
      navigateTo(joinPath(name));
  };


  return (
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
          <DropdownMenuItem>Info</DropdownMenuItem>
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FolderComponent;
