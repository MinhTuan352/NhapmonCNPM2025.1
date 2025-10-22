// src/components/layout/MainLayout.tsx
import { Box, AppBar, Toolbar, Typography, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  // Lấy chiều rộng của Sidebar (ví dụ: 240px)
  // const drawerWidth = 240; 

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Header (Thanh điều hướng ngang) */}
      <AppBar 
        position="fixed" 
        // Cài đặt màu xanh đậm cho Header
        sx={{ 
          backgroundColor: '#0A4A9C', // Màu xanh đậm
          // Đảm bảo Header nằm trên Sidebar
          zIndex: (theme) => theme.zIndex.drawer + 1 
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            BLUEMOON
          </Typography>
          {/* (Thêm các nút điều hướng, menu user ở đây) */}
        </Toolbar>
      </AppBar>

      {/* (Đây là Sidebar trái - Bạn sẽ code nó sau)
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar /> 
          <Box sx={{ overflow: 'auto' }}>
             // (Menu list QTV, Cư dân... sẽ ở đây)
          </Box>
        </Drawer> 
      */}

      {/* Nội dung trang */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Toolbar /> {/* Thêm khoảng đệm để nội dung không bị Header che mất */}
        
        {/* Đây là nơi các trang con (list, profile, v.v.) sẽ hiển thị */}
        <Outlet /> 
      </Box>
    </Box>
  );
}