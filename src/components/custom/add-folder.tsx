import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/utils";

export default function AddFolder() {
  const queryClient = useQueryClient();
  const currentPath = window.location.pathname.replace(/\/$/, "");

  const mutation = useMutation({
    mutationFn: async (name: string) => {
      return (
        await axiosInstance.put(
          `${currentPath}/${name}?op=MKDIRS&user.name=${import.meta.env.VITE_HDFS_USER
          }`
        )
      ).data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stuff"] });
      toast.success("Folder created successfully");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    mutation.mutate(name);
    setInterval(() => {
      window.location.reload();
    }, 2650)
  };

  return (
    <form className="flex items-center gap-x-2.5" onSubmit={handleSubmit}>
      <Input disabled={mutation.isPending} name="name" />
      <Button type="submit" className="cursor-pointer" disabled={mutation.isPending}>Add Folder</Button>
    </form>
  );
}
