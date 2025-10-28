// src/pages/BOD/NotificationManagement/NotificationList.tsx
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Tooltip,
  Chip, // --- THÊM MỚI ---
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid';

// Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { useWindowWidth } from '../../../hooks/useWindowWidth';
import { useLayout } from '../../../contexts/LayoutContext';

const SIDEBAR_WIDTH_OPEN = 240;
const SIDEBAR_WIDTH_COLLAPSED = 72;
// p: 3 (padding của MainLayout) = 3 * 8px = 24px. (Trái 24px, Phải 24px)
const PAGE_PADDING = 48;

// --- CẬP NHẬT MOCK DATA ---
const mockNotifications: GridRowsProp = [
  { 
    id: 'TB001', 
    title: 'Thông báo lịch cắt điện Tòa A', 
    created_by: 'BQL Nguyễn Văn A',
    created_at: '2025-10-28T10:30:00',
    target: 'Tất cả Cư dân',
    recipients_count: 150,
    type: 'Khẩn cấp', // <-- THÊM MỚI
    scheduled_at: null, // <-- THÊM MỚI
  },
  { 
    id: 'TB002', 
    title: 'Thông báo họp tổ dân phố Quý 4', 
    created_by: 'BQL Trần Thị B',
    created_at: '2025-10-27T15:00:00',
    target: 'Tất cả Cư dân',
    recipients_count: 150,
    type: 'Chung', // <-- THÊM MỚI
    scheduled_at: null,
  },
  { 
    id: 'TB003', 
    title: 'Nhắc nhở đóng phí quản lý T10/2025', 
    created_by: 'Kế toán Lê Văn C',
    created_at: '2025-10-25T09:00:00',
    target: 'Cá nhân (Nợ phí)',
    recipients_count: 22,
    type: 'Thu phí', // <-- THÊM MỚI
    scheduled_at: null,
  },
  { 
    id: 'TB004', 
    title: 'Thông báo lịch phun thuốc muỗi (Hẹn giờ)', 
    created_by: 'BQL Nguyễn Văn A',
    created_at: '2025-10-24T11:00:00', // (Thời gian tạo)
    target: 'Tất cả Cư dân',
    recipients_count: 150,
    type: 'Chung',
    scheduled_at: '2025-10-30T09:00:00', // <-- THÊM MỚI (Thời gian sẽ gửi)
  },
];

// --- CẬP NHẬT ĐỊNH NGHĨA CỘT ---
const columns: GridColDef[] = [
  { field: 'id', headerName: 'Mã TB', width: 90 },
  { field: 'title', headerName: 'Tiêu đề', flex: 1, minWidth: 250 },
  // --- THÊM MỚI: CỘT LOẠI ---
  { 
    field: 'type', 
    headerName: 'Loại', 
    width: 100,
    renderCell: (params) => {
      const type = params.value;
      let color: "error" | "warning" | "primary" = "primary";
      if (type === 'Khẩn cấp') color = 'error';
      if (type === 'Thu phí') color = 'warning';
      return <Chip label={type} color={color} size="small" />;
    }
  },
  { field: 'created_by', headerName: 'Người gửi', width: 150 },
  { 
    field: 'created_at', 
    headerName: 'Ngày tạo', 
    width: 160,
    type: 'dateTime',
    valueGetter: (value) => new Date(value),
    valueFormatter: (value: Date) => value.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
  },
  // --- THÊM MỚI: CỘT LỊCH GỬI ---
  { 
    field: 'scheduled_at', 
    headerName: 'Lịch gửi', 
    width: 160,
    type: 'dateTime',
    valueGetter: (value) => (value ? new Date(value) : null),
    renderCell: (params) => {
      if (!params.value) {
        return <Typography variant="body2" sx={{ color: 'text.secondary' }}>Gửi ngay</Typography>;
      }
      return params.value.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
    }
  },
  { field: 'target', headerName: 'Đối tượng', width: 130 },
  { 
    field: 'recipients_count', 
    headerName: 'Số lượng nhận', 
    width: 120,
    type: 'number',
    valueFormatter: (value: number) => `${value} người`,
  },
  {
    field: 'actions',
    headerName: 'Hành động',
    width: 120,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      const navigate = useNavigate(); // Hook phải được gọi bên trong
      return (
        <Box>
          <Tooltip title="Xem chi tiết">
            {/* CẬP NHẬT: onClick */}
            <IconButton size="small" onClick={() => navigate(`/bod/notification/detail/${params.row.id}`)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sao chép">
            <IconButton size="small" onClick={() => alert(`Copy: ${params.row.id}`)}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>
      );
    }
  }
];

export default function NotificationList() {
  const navigate = useNavigate();

  const windowWidth = useWindowWidth();
  
    // 2. LẤY STATE TỪ CONTEXT
    const { isSidebarCollapsed } = useLayout(); 
  
    // 3. TÍNH TOÁN
    const dynamicPaperWidth = windowWidth 
                              - (isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_OPEN) 
                              - PAGE_PADDING;

  const handleCreateNotification = () => {
    navigate('/bod/notification/create');
  };

  return (
    <>
      {/* --- 1. TIÊU ĐỀ + NÚT TẠO MỚI --- */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          LỊCH SỬ THÔNG BÁO
        </Typography>
        <Button
          variant="contained"
          onClick={handleCreateNotification} // <-- Yêu cầu 1c
        >
          Tạo thông báo
        </Button>
      </Box>

      {/* --- 2. BẢNG DỮ LIỆU (Giống FeeList) --- */}
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Paper sx={{ 
          height: '100%', 
          width: dynamicPaperWidth, 
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <DataGrid
            rows={mockNotifications}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            sx={{
              border: 0,
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                outline: 'none',
              },
              '&.MuiDataGrid-root': { p: 2 },
              minWidth: '900px', // Đảm bảo bảng không bị vỡ
            }}
          />
        </Paper>
      </Box>
    </>
  );
}