import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useModal } from "@/context/modal";
import { axiosInstance } from "@/lib/utils";
import { usePath } from "@/context/path";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

function RenameDialog() {
  const { currentPath, joinPath } = usePath();
  const { modalType, fileInfo, closeModal } = useModal();
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (fileInfo?.name) {
      setNewName(fileInfo?.name);
    }
  }, [fileInfo?.name]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return (
        await axiosInstance.put(`/${fileInfo?.type.toLowerCase()}/rename`, {
          old_path: joinPath(fileInfo?.name as string),
          new_path: joinPath(newName),
        })
      ).data;
    },
    onSuccess: () => {
      toast.success("Rename successed");
      queryClient.invalidateQueries({ queryKey: ["fileList", currentPath] });
    },
    onSettled: () => {
      closeModal();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() === "") {
      toast.error("Please enter a valid name");
      return;
    }
    mutation.mutate();
  }

  return (
    <AlertDialog open={modalType === "rename"} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rename</AlertDialogTitle>
          <AlertDialogDescription>
            Enter a new name for this file or folder.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full border p-2 rounded-md"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <AlertDialogFooter className="mt-3">
            <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={mutation.isPending}>Rename</Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default RenameDialog;
