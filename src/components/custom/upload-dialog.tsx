import { useCallback, useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
function UploadDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500">Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <FileUpload openDialog={setIsOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, X } from "lucide-react";
import { axiosInstance} from "@/lib/utils";
import { usePath } from "@/context/path.ts";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const FileUpload = ({
  openDialog,
}: {
  openDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  const { currentPath} = usePath();
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const removeFile = () => {
    setFile(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axiosInstance.post("/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("File uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["fileList", currentPath] });
    },
    onSettled: () => {
      removeFile();
      openDialog(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
          toast.error(error.response?.data.message || "Upload failed");
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", currentPath);
    mutation.mutate(formData);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-gray-500">
          <Upload className="h-10 w-10 mb-2" />
          {isDragActive ? (
            <p className="font-medium">Drop the file here...</p>
          ) : (
            <>
              <p className="font-medium">
                Drag & drop a file here, or click to select a file
              </p>
              <p className="text-sm mt-1">Upload a file to current directory</p>
            </>
          )}
        </div>
      </div>

      {file && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Selected file</h3>
            <Button
              disabled={mutation.isPending}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={handleUpload}
              type="button"
            >
              {mutation.isPending ? "Uploading..." : "Upload File"}
            </Button>
          </div>

          <div className="bg-gray-50 rounded p-3">
            <div className="flex items-center justify-between">
              <div className="truncate flex-1 text-sm">
                {file.name}{" "}
                <span className="text-gray-400 text-xs">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                onClick={removeFile}
                className="text-gray-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDialog;
