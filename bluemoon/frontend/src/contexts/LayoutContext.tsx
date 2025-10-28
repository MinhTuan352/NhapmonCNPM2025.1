// src/contexts/LayoutContext.tsx
import { createContext, useContext } from 'react';

// Định nghĩa những gì Context sẽ cung cấp
interface LayoutContextType {
  isSidebarCollapsed: boolean;
}

// Tạo Context
export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Tạo custom hook (để dễ sử dụng)
export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}