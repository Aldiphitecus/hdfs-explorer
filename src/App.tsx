import { useQuery } from "@tanstack/react-query";
import AddFolder from "./components/custom/add-folder";
import FolderComponent from "./components/custom/folder";
import { axiosInstance } from "./lib/utils";
function App() {

  const {data} = useQuery({
    queryKey: ["stuff"],
    queryFn: async () => {
      return (await axiosInstance.get(`user/${import.meta.env.VITE_HDFS_USER}/?op=LISTSTATUS`)).data;
    }
  })


  return (
    <div className="container">
      <header>
        <h1 className="font-bold text-3xl">Hadoop File Explorer</h1>
      </header>

      <div className="float-right">
        <AddFolder />
      </div>
      <div className="mt-3 grid w-full grid-cols-6 gap-4">
        {data && data.FileStatuses.FileStatus.map((file) => (
          <FolderComponent key={file.pathSuffix} name={file.pathSuffix} />
        ))}
      </div>
    </div>
  );
}

export default App;
