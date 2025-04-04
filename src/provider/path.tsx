import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PathContext } from '../context/path';

interface PathProviderProps {
  children: React.ReactNode;
}

export const PathProvider: React.FC<PathProviderProps> = ({ children }) => {
    const params = useParams();
    const navigate = useNavigate();
    
    // Get current path from URL, defaults to root
    const currentPath = params["*"] ? `/${params["*"]}` : "/";
    
    const navigateUp = () => {
      if (currentPath === "/") return;
      const parts = currentPath.split('/').filter(Boolean);
      parts.pop();
      const parentPath = parts.length === 0 ? "/" : `/${parts.join("/")}`;
      navigate(parentPath);
    };
    
    const navigateTo = (path: string) => {
      navigate(path);
    };
    
    const joinPath = (suffix: string) => {
      if (currentPath.endsWith('/')) {
        return `${currentPath}${suffix}`;
      }
      return `${currentPath}/${suffix}`;
    };
  
  return (
    <PathContext.Provider value={{ currentPath, navigateUp, navigateTo, joinPath }}>
      {children}
    </PathContext.Provider>
  );
};