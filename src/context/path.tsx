import { createContext, useContext} from 'react';

export interface PathContextType {
  currentPath: string;
  navigateUp: () => void;
  navigateTo: (path: string) => void;
  joinPath: (suffix: string) => string;
}

export const PathContext = createContext<PathContextType | undefined>(undefined);


export const usePath = (): PathContextType => {
  const context = useContext(PathContext);
  if (context === undefined) {
    throw new Error('usePath must be used within a PathProvider');
  }
  return context;
};