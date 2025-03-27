import { truncate } from "@/lib/utils";
import { Folder, EllipsisVertical } from "lucide-react";
import React from "react";

interface FolderProps {
  name: string;
  onClick?: () => void;
}

const FolderComponent: React.FC<FolderProps> = ({ name, onClick }) => {
  return (
    <div
      className="flex items-center p-4 rounded-2xl bg-gray-100 justify-between hover:bg-gray-200"
      onClick={onClick}
    >
      <Folder color="#3e9392" fill="black" />

      <p>{truncate(name, 13)}</p>
      <button className="p-1 rounded-full hover:bg-gray-300 cursor-pointer">
        <EllipsisVertical />
      </button>
    </div>
  );
};

export default FolderComponent;
