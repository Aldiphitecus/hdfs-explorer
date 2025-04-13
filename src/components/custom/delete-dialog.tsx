import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/utils";
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
import { usePath } from "@/context/path";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";
import { RemoteExceptionWrapper } from "@/type";

const DeleteDialog = () => {
  const { modalType, fileInfo, closeModal } = useModal();
  const { currentPath, joinPath } = usePath();
//   console.log(joinPath(currentPath))
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return (await axiosInstance.delete(`${joinPath(fileInfo?.name ?? "")}?op=DELETE`)).data;
    },
    onSuccess: () => {
      toast.success("Delete successed");
      queryClient.invalidateQueries({ queryKey: ["fileList", currentPath] });
    },
    onSettled: () => {
        closeModal();
    },
    onError: (e: AxiosError) => {
        const errorData = e.response?.data as RemoteExceptionWrapper;
        toast.error(errorData?.RemoteException?.message || "An error occurred");
    }
  });

  return (
    <AlertDialog open={modalType === "delete"} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {fileInfo?.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong>{fileInfo?.name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant={"destructive"}
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Yes, Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
