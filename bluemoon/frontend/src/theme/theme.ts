// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    // Màu xanh của các nút và tag
    primary: {
      main: '#1976D2', // Đây là màu xanh của nút "Tạo tài khoản"
    },
    // (Tùy chọn) Màu cho các nút "Export"
    secondary: {
      main: '#6c757d', 
    },
    // Màu nền chung của trang (màu xám nhạt)
    background: {
      default: '#f4f6f8',
      paper: '#ffffff', // Màu nền của các "thẻ" (card)
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
    // Cài đặt mặc định cho tiêu đề trang (giống "DANH SÁCH...")
    h5: {
      fontWeight: 700, // In đậm
      fontSize: '1.5rem',
    },
    // Cài đặt mặc định cho tiêu đề thẻ (giống "Nguyễn Văn A")
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
  },
  
  // Ghi đè style mặc định của component MUI
  components: {
    
    // 1. Ghi đè NÚT (Button)
    MuiButton: {
      defaultProps: {
        variant: 'contained', // Mặc định là nút có nền
        disableElevation: true, // Bỏ bóng đổ (shadow)
      },
      styleOverrides: {
        root: {
          textTransform: 'none', // QUAN TRỌNG: Không tự VIẾT HOA
          borderRadius: 8,       // Bo góc 8px (giống nút "Tạo tài khoản")
        },
      },
    },

    // 2. Ghi đè THẺ (Card) - Dùng cho các list item
    MuiCard: {
      defaultProps: {
        elevation: 0, // Tắt shadow mặc định
      },
      styleOverrides: {
        root: {
          borderRadius: 12, // Bo góc nhiều hơn
          // Thêm shadow tùy chỉnh giống ảnh
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },

    // 3. Ghi đè TAG (Chip) - Dùng cho "Ban quản trị", "Kế toán"
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Bo tròn (pill shape)
          fontWeight: 600,
        },
        // Style cho chip <Chip color="primary" />
        colorPrimary: {
          backgroundColor: '#1976D2', // (primary.main)
          color: '#ffffff', // Chữ trắng
        },
      },
    },
  },
});