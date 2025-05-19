import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggleSidebar: () => {},
});

/**
 * 侧边栏状态管理Provider
 * 用于在应用程序中共享侧边栏的展开/收起状态
 */
export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

/**
 * 使用侧边栏状态的自定义Hook
 * 在组件中使用: const { isCollapsed, toggleSidebar } = useSidebar();
 */
export const useSidebar = () => useContext(SidebarContext);

export default SidebarContext; 