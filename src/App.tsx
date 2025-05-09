import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { File,Pencil,Trash2 } from "lucide-react";
import axios from "axios";

// ---------------------
// ENVIRONMENT
// ---------------------
const HDFS_BASE_URL = import.meta.env.VITE_WEBHDFS_URL;
const HDFS_USER = import.meta.env.VITE_HDFS_USER;

// ---------------------
// AXIOS INSTANCE
// ---------------------
export const axiosInstance = axios.create({
  baseURL: HDFS_BASE_URL,
  params: {
    "user.name": HDFS_USER,
  },
});

// ---------------------
// PATH CONTEXT
// ---------------------
const PathContext = createContext<any>(null);

function PathProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState("/");

  const navigateUp = () => {
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    setCurrentPath("/" + parts.join("/"));
  };

  return (
    <PathContext.Provider value={{ currentPath, setCurrentPath, navigateUp }}>
      {children}
    </PathContext.Provider>
  );
}

function usePath() {
  return useContext(PathContext);
}

// ---------------------
// ADD FOLDER COMPONENT
// ---------------------
function AddFolder() {
  const { currentPath } = usePath();
  const [folderName, setFolderName] = useState("");

  const handleCreate = async () => {
    if (!folderName.trim()) return;

    try {
      await axiosInstance.put(`${currentPath}/${folderName}`, null, {
        params: { op: "MKDIRS" },
      });
      window.location.reload();
    } catch (err) {
      console.error("Failed to create folder:", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        className="border px-2 py-1 rounded text-sm"
        placeholder="New folder name"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        onClick={handleCreate}
      >
        Create
      </button>
    </div>
  );
}

// ---------------------
// FOLDER COMPONENT
// ---------------------
function FolderComponent({
  name,
  owner,
  type,
  modificationTime,
}: {
  name: string;
  owner: string;
  type: string;
  modificationTime: number;
}) {
  const isFolder = type === "DIRECTORY";
  const { currentPath, setCurrentPath } = usePath();
  const formattedDate = new Date(modificationTime).toLocaleDateString();
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleClick = () => {
    if (isFolder) {
      setCurrentPath(
        currentPath.endsWith("/") ? `${currentPath}${name}` : `${currentPath}/${name}`
      );
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await axiosInstance.delete(`${currentPath}/${name}`, {
        params: { op: "DELETE" },
      });
      window.location.reload();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleRename = async () => {
    if (!newName || newName === name) return;
    try {
      const destination = `${currentPath}/${newName}`;
      await axiosInstance.put(`${currentPath}/${name}`, null, {
        params: {
          op: "RENAME",
          destination,
        },
      });
      window.location.reload();
    } catch (err) {
      console.error("Rename failed:", err);
    }
  };

  return (
    <div
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow group relative"
    >
      <div onClick={handleClick} className="flex flex-col items-center text-center">
        <div className="text-blue-500 mb-2">
          {isFolder ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7h4l2 2h10a1 1 0 011 1v7a1 1 0 01-1 1H3V7z"
              />
            </svg>
          ) : (
            <File className="h-8 w-8" />
          )}
        </div>
        {renaming ? (
          <>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="text-sm border rounded px-1"
            />
            <button
              onClick={handleRename}
              className="text-xs text-blue-600 hover:underline mt-1"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <div className="font-medium text-gray-800 truncate">{name}</div>
            <div className="text-xs text-gray-500 truncate">{owner}</div>
            <div className="text-xs text-gray-400">{formattedDate}</div>
          </>
        )}
      </div>

      <div className="absolute top-2 right-2 flex gap-1">
        <button
          className="text-gray-500 hover:text-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            setRenaming(true);
          }}
          title="Rename"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          className="text-gray-500 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


// ---------------------
// EXPLORER COMPONENT
// ---------------------
function Explorer() {
  const { currentPath, navigateUp } = usePath();

  const { data } = useQuery({
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
          <AddFolder />
        </div>
      </header>

      {/* File grid */}
      <main className="p-6">
        {data?.FileStatuses.FileStatus.length === 0 ? (
          <div className="text-center text-gray-400 mt-12">
            <File className="mx-auto mb-2 w-10 h-10" />
            <p>No files or folders</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data?.FileStatuses.FileStatus.map((file: any) => (
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
              <Explorer />
            </PathProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
