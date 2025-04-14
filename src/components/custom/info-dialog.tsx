import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/context/modal";
function InfoDialog() {
  const { modalType, fileInfo, closeModal } = useModal();
  return (
    <Dialog open={modalType === "info"} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <span className="w-full">
            <small className="font-bold">Name</small>
            <p>{fileInfo?.name}</p>
          </span>
          <span className="w-full">
            <small className="font-bold">Type</small>
            <p>{fileInfo?.type.toLowerCase()}</p>
          </span>
          <span>
            <small className="font-bold">Size</small>
            <p>{fileInfo?.size}</p>
          </span>
          <span className="w-full">
            <small className="font-bold">Modification time</small>
            <p>
              {new Date(
                fileInfo?.modificationTime as number
              ).toLocaleDateString()}
            </p>
          </span>
          <span className="w-full">
            <small className="font-bold">Owner</small>
            <p>{fileInfo?.owner}</p>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InfoDialog;
