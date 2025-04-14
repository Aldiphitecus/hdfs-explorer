import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { File } from "lucide-react";

import { FileStatusResponse } from "@/type";
import CreateFolder from "@/components/custom/create-folder";
import FolderComponent from "@/components/custom/folder";
import FileComponent from "@/components/custom/file";
import { usePath } from "@/context/path.ts";
import { axiosInstance, formatSize } from "@/lib/utils";
import { PathProvider } from "@/provider/path";
import RenameDialog from "@/components/custom/rename-dialog";
import { ModalProvider } from "@/provider/modal";
import DeleteDialog from "./components/custom/delete-dialog";
import InfoDialog from "./components/custom/info-dialog";
import UploadDialog from "./components/custom/upload-dialog";

// ---------------------
// EXPLORER COMPONENT
// ---------------------
function Explorer() {
  const { currentPath, navigateUp } = usePath();

  const { data } = useQuery<FileStatusResponse>({
    queryKey: ["fileList", currentPath],
    queryFn: async () => {
      return (
        await axiosInstance.get("/directory", {
          params: {
            path: currentPath,
          },
        })
      ).data;
    },
  });

  const directories =
    data?.FileStatuses.FileStatus.filter((file) => file.type === "DIRECTORY") ||
    [];

  const files =
    data?.FileStatuses.FileStatus.filter((file) => file.type === "FILE") || [];

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
            {
              currentPath !== "/" && (
                <button
                  onClick={navigateUp}
                  className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  ⬆️ Go Up
                </button>
              )
            }
            <CreateFolder />
            <UploadDialog />
          </div>
        </header>

        <main className="p-6">
          {data?.FileStatuses.FileStatus.length == 0 ? (
            <div className="text-center text-gray-400 mt-12">
              <File className="mx-auto mb-2 w-10 h-10" />
              <p>No files or folders</p>
            </div>
          ) : (
            <>
              {directories.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-medium mb-4 text-gray-700">Directories</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {directories.map((file) => (
                      <FolderComponent
                        key={file.pathSuffix}
                        name={file.pathSuffix}
                        owner={file.owner}
                        type={file.type}
                        size={formatSize(file.length)}
                        modificationTime={file.modificationTime}
                      />
                    ))}
                  </div>
                </div>
              )}

              {files.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-medium mb-4 text-gray-700">Files</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {files.map((file) => (
                      <FileComponent
                        key={file.pathSuffix}
                        name={file.pathSuffix}
                        owner={file.owner}
                        type={file.type}
                        size={formatSize(file.length)}
                        modificationTime={file.modificationTime}
                      />
                    ))}
                  </div>
                </div>
              )}


            </>
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
