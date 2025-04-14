import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/utils";
import { usePath } from "@/context/path.ts";
import { AxiosError } from "axios";

export default function CreateFolder() {
  const queryClient = useQueryClient();

  const {currentPath, joinPath} = usePath()
  const [name, setName] = useState("");


  const mutation = useMutation({
    mutationFn: async (name: string) => {
      return (
        await axiosInstance.post("/directory", {
          path: joinPath(name),
        })
      ).data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fileList", currentPath] });
      toast.success("Folder created successfully");
      setName("")
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Failed to create folder");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name === "") {
      toast.error("Folder cannot be empty")
      return
    }
    mutation.mutate(name);
  };

  return (
    <form className="flex items-center gap-x-2.5" onSubmit={handleSubmit}>
      <Input disabled={mutation.isPending} value={name} onChange={(e) => setName(e.target.value)} placeholder="New Folder" className="border px-2 py-1 rounded text-sm" />
      <Button type="submit" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm" disabled={mutation.isPending}>Create Folder</Button>
    </form>
  );
}
