import { useQuery } from "@tanstack/react-query";
import { FileStatusResponse } from "./constant/file-status";
import AddFolder from "./components/custom/add-folder";
import FolderComponent from "./components/custom/folder";
import { axiosInstance } from "./lib/utils";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { usePath } from "./context/path";
import { PathProvider } from "./provider/path";

function Explorer() {
  const { currentPath, navigateUp } = usePath();

  const { data } = useQuery<FileStatusResponse>({
    queryKey: ["fileList", currentPath],
    queryFn: async () => {
      return (
        await axiosInstance.get(currentPath, {
          params: {
            op: "LISTSTATUS",
          },
        })
      ).data;
    },
  });
  return (
    <div className="container">
      <header>
        <h1 className="font-bold text-3xl">Hadoop File Explorer</h1>
        <div className="text-gray-600 mt-2">Current path: {currentPath}</div>
      </header>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={navigateUp}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Go Up
        </button>
        <div>
          <AddFolder />
        </div>
      </div>

      <div className="mt-3 grid w-full grid-cols-6 gap-4">
        {data &&
          data.FileStatuses.FileStatus.map((file) => (
            <FolderComponent key={file.pathSuffix} name={file.pathSuffix} owner={file.owner} type={file.type} modificationTime={file.modificationTime} />
          ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            <PathProvider>
              <Explorer />
            </PathProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
