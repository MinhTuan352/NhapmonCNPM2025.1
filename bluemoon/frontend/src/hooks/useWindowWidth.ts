// src/hooks/useWindowWidth.ts
import { useState, useEffect } from 'react';

function getWindowWidth() {
  const { innerWidth: width } = window;
  return width;
}

export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());

  useEffect(() => {
    function handleResize() {
      setWindowWidth(getWindowWidth());
    }

    // Đăng ký lắng nghe sự kiện 'resize'
    window.addEventListener('resize', handleResize);
    
    // Hủy đăng ký khi component bị unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Chỉ chạy 1 lần lúc component mount

  return windowWidth;
}