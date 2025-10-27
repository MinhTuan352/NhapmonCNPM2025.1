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
  IconButton, // --- THÊM MỚI ---
  Avatar, // --- THÊM MỚI ---
  Menu, // --- THÊM MỚI ---
  MenuItem, // --- THÊM MỚI ---
  InputBase, // --- THÊM MỚI ---
} from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react'; // --- THÊM MỚI ---
import { alpha } from '@mui/material/styles'; // --- THÊM MỚI ---
import { useAuth } from '../../contexts/AuthContext'; // --- THÊM MỚI ---

// --- THÊM MỚI CÁC ICON ---
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

// Import icons cho sidebar
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

import sidebarBackground from '../../assets/bluemoon-background.jpg';
//import { theme } from '../../theme/theme';

const drawerWidth = 240; // Chiều rộng của Sidebar
const collapsedWidth = 72; // Chiều rộng khi thu gọn

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
  const { user, logout } = useAuth(); // --- THÊM MỚI --- (Cho Yêu cầu 3)

  // --- THÊM MỚI --- (State cho Yêu cầu 2: Toggle Sidebar)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dynamicWidth = isCollapsed ? collapsedWidth : drawerWidth;

  // --- THÊM MỚI --- (State cho Yêu cầu 3: Menu Avatar)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  // --- THÊM MỚI --- (Handlers)
  const handleSidebarToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/signin');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* 1. Header (CẬP NHẬT) */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#004E7A', // Màu xanh đậm
          zIndex: (theme) => theme.zIndex.drawer + 1, // Luôn nằm trên Sidebar
        }}
      >
        <Toolbar>
          {/* --- THÊM MỚI --- (Yêu cầu 2: Nút Toggle) */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* --- CẬP NHẬT --- (Yêu cầu 6: Đổi Font) */}
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              fontFamily: '"ITCBenguiat"',
              letterSpacing: '1px',
            }}
          >
            BLUEMOON
          </Typography>

          {/* --- THÊM MỚI --- (Spacer để đẩy sang phải) */}
          <Box sx={{ flexGrow: 1 }} />

          {/* --- THÊM MỚI --- (Yêu cầu 5: Search Bar) */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: '999px', // Bo tròn
              backgroundColor: alpha('#FFFFFF', 0.15),
              '&:hover': {
                backgroundColor: alpha('#FFFFFF', 0.25),
              },
              marginLeft: 3,
              marginRight: 3,
              width: 'auto',
            }}
          >
            <Box
              sx={{
                padding: (theme) => theme.spacing(0, 2),
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Tìm kiếm..."
              inputProps={{ 'aria-label': 'search' }}
              sx={{
                color: 'inherit',
                '& .MuiInputBase-input': {
                  padding: (theme) => theme.spacing(1, 1, 1, 0),
                  paddingLeft: (theme) => `calc(1em + ${theme.spacing(4)})`,
                  width: '300px', // Tăng chiều rộng
                },
              }}
            />
          </Box>

          

          {/* --- THÊM MỚI --- (Yêu cầu 3: Avatar Dropdown) */}
          <Box>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar alt={user?.username || 'User'} src="/static/images/avatar/2.jpg" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              // Căn chỉnh menu
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem disabled>{user?.username}</MenuItem>
              <MenuItem onClick={handleMenuClose}>Xem hồ sơ tài khoản</MenuItem>
              <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Menu>
          </Box>

        </Toolbar>
      </AppBar>

      {/* 2. Sidebar (CẬP NHẬT) */}
      <Drawer
        variant="permanent" // Luôn hiển thị
        sx={{
          width: dynamicWidth, // --- CẬP NHẬT --- (Yêu cầu 2)
          flexShrink: 0,
          transition: (theme) => theme.transitions.create('width', { // --- THÊM MỚI ---
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),

          [`& .MuiDrawer-paper`]: {
            width: dynamicWidth, // --- CẬP NHẬT --- (Yêu cầu 2)
            boxSizing: 'border-box',
            backgroundColor: 'transparent',
            borderRight: 'none',
            overflowX: 'hidden', // --- THÊM MỚI --- (Quan trọng khi thu gọn)

            transition: (theme) => theme.transitions.create('width', { // --- THÊM MỚI ---
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            
            // --- THÊM MỚI --- (Yêu cầu 1: Ảnh chìm)
            //position: 'relative', // Bật nếu dùng pseudo-element
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(rgba(72, 72, 72, 0.8), rgba(72, 72, 72, 0.8)), url(${sidebarBackground})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom center',
              backgroundSize: 'cover',
              //opacity: 0.5,
              zIndex: -1,
            }
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
                      justifyContent: isCollapsed ? 'center' : 'initial',
                      color: '#ffffff',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',

                      '& .MuiSvgIcon-root': {
                        color: '#ffffff',
                      },

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
                    <ListItemIcon sx={{ 
                      minWidth: 40,
                      justifyContent: 'center', // --- THÊM MỚI ---
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    {/* --- CẬP NHẬT --- (Ẩn text khi thu gọn) */}
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ fontWeight: 'bold' }} 
                      sx={{ 
                        display: isCollapsed ? 'none' : 'block',
                        opacity: isCollapsed ? 0 : 1,
                        width: isCollapsed ? 0 : 'auto',
                        transition: (theme) => theme.transitions.create(['opacity', 'width'], {
                          easing: theme.transitions.easing.sharp,
                          duration: theme.transitions.duration.enteringScreen,
                        })
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* 3. Vùng nội dung chính (CẬP NHẬT) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: 'background.default',
          minHeight: '100vh',
          // --- CẬP NHẬT --- (Yêu cầu 2: Điều chỉnh width)
          width: `calc(100% - ${dynamicWidth}px)`,
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar /> {/* Thêm khoảng trống bằng Header */}

        {/* Đây là nơi AdminList.tsx sẽ được render */}
        <Outlet />
      </Box>
    </Box>
  );
}