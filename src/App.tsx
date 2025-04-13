import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { File } from "lucide-react";

import { FileStatusResponse } from "@/type";
import CreateFolder from "@/components/custom/create-folder";
import FolderComponent from "@/components/custom/folder";
import { usePath } from "@/context/path.ts";
import { axiosInstance } from "@/lib/utils";
import { PathProvider } from "@/provider/path";
import RenameDialog from "@/components/custom/rename-dialog";
import { ModalProvider } from "@/provider/modal";
import DeleteDialog from "./components/custom/delete-dialog";
import InfoDialog from "./components/custom/info-dialog";

// ---------------------
// EXPLORER COMPONENT
// ---------------------
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
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white shadow-md px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">📁 Hadoop File Explorer</h1>
            <p className="text-sm text-gray-500">Path: {currentPath}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={navigateUp}
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              ⬆️ Go Up
            </button>
            <CreateFolder />
          </div>
        </header>

   
        <main className="p-6">
          {data?.FileStatuses.FileStatus.length == 0 ? (
            <div className="text-center text-gray-400 mt-12">
              <File className="mx-auto mb-2 w-10 h-10" />
              <p>No files or folders</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {data?.FileStatuses.FileStatus.map((file) => (
                <FolderComponent
                  key={file.pathSuffix}
                  name={file.pathSuffix}
                  owner={file.owner}
                  type={file.type}
                  modificationTime={file.modificationTime}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      
      <InfoDialog />
      <RenameDialog />
      <DeleteDialog />
    </>
  );
}

// ---------------------
// APP ROOT
// ---------------------
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            <PathProvider>
              <ModalProvider>
                <Explorer />
              </ModalProvider>
            </PathProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
