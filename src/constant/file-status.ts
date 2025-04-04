/**
 * Represents a file or directory in the Hadoop filesystem.
 */
export interface FileStatus {
  accessTime: number;
  blockSize: number;
  childrenNum: number;
  fileId: number;
  group: string;
  length: number;
  modificationTime: number;
  owner: string;
  pathSuffix: string;
  permission: string;
  replication: number;
  storagePolicy: number;
  type: "DIRECTORY" | "FILE";
}

/**
 * Contains an array of FileStatus objects.
 */
export interface FileStatuses {
  FileStatus: FileStatus[];
}

/**
 * The root response structure from the Hadoop HDFS API.
 */
export interface FileStatusResponse {
  FileStatuses: FileStatuses;
}