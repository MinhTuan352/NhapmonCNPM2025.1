// src/components/layout/MainLayout.tsx
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

// Import icons cho sidebar
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const drawerWidth = 240; // Chiều rộng của Sidebar

// Danh sách menu [cite: 8]
const menuItems = [
  { text: 'QTV', icon: <AdminPanelSettingsIcon />, path: '/bod/admin/list' }, // 
  { text: 'Cư dân', icon: <PeopleIcon />, path: '/bod/resident/list' }, // [cite: 28]
  { text: 'Công nợ', icon: <ReceiptLongIcon />, path: '/bod/fee/list' }, // [cite: 45]
  { text: 'Thông báo', icon: <NotificationsIcon />, path: '/bod/notification/list' }, // [cite: 47]
  { text: 'Sự cố', icon: <ReportProblemIcon />, path: '/bod/report/list' }, // [cite: 48]
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation(); // Dùng để xác định trang active

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* 1. Header (giữ nguyên) [cite: 5, 9] */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#0A4A9C', // Màu xanh đậm
          zIndex: (theme) => theme.zIndex.drawer + 1, // Luôn nằm trên Sidebar
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{fontFamily: 'serif', fontWeight: 'bold'}}>
            BLUEMOON
          </Typography>
          {/* (Phần tìm kiếm và menu User [cite: 6] sẽ thêm sau) */}
        </Toolbar>
      </AppBar>

      {/* 2. Sidebar (Mới) */}
      <Drawer
        variant="permanent" // Luôn hiển thị
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff', // Nền trắng
            borderRight: 'none',
          },
        }}
      >
        <Toolbar /> {/* Thêm khoảng trống đúng bằng Header */}
        <Box sx={{ overflow: 'auto', pt: 2 }}>
          <List>
            {menuItems.map((item) => {
              // Kiểm tra xem path hiện tại có active không
              const isActive = location.pathname.startsWith(item.path); 
              
              return (
                <ListItem key={item.text} disablePadding sx={{ px: 2, mb: 1 }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    selected={isActive} // Đánh dấu active
                    sx={{
                      borderRadius: '8px',
                      // Style cho nút active
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main', // Màu xanh
                        color: 'primary.contrastText', // Chữ trắng
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'primary.contrastText', // Icon trắng
                        }
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} primaryTypographyProps={{fontWeight: 'medium'}} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* 3. Vùng nội dung chính */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3, // 3 * 8px = 24px padding
          backgroundColor: 'background.default', // Màu xám nhạt từ theme
          minHeight: '100vh',
        }}
      >
        <Toolbar /> {/* Thêm khoảng trống bằng Header */}
        
        {/* Đây là nơi AdminList.tsx sẽ được render */}
        <Outlet /> 
      </Box>
    </Box>
  );
}