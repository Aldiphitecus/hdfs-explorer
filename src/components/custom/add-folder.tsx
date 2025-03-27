import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/utils";

export default function AddFolder() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (name: string) => {
      return (
        await axiosInstance.put(
          `${name}?op=MKDIR&user.name=${
            import.meta.env.HDFS_USER
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
  };

  return (
    <form className="flex items-center gap-x-2.5" onSubmit={handleSubmit}>
      <Input />
      <Button type="submit">Add Folder</Button>
    </form>
  );
}
