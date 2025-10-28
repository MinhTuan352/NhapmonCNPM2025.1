// src/pages/BOD/ReportManagement/ReportList.tsx
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid';

// Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

import { useWindowWidth } from '../../../hooks/useWindowWidth';
import { useLayout } from '../../../contexts/LayoutContext';

type ReportStatus = 'Mới' | 'Đang xử lý' | 'Hoàn thành' | 'Đã hủy';

const SIDEBAR_WIDTH_OPEN = 240;
const SIDEBAR_WIDTH_COLLAPSED = 72;
// p: 3 (padding của MainLayout) = 3 * 8px = 24px. (Trái 24px, Phải 24px)
const PAGE_PADDING = 48;


// --- DỮ LIỆU GIẢ (MOCK DATA) ---
const mockReports: GridRowsProp = [
  { 
    id: 'SC001', 
    title: 'Vỡ ống nước khu vực hầm B2', 
    reported_by: 'Trần Văn Hộ (A-101)',
    location: 'Hầm B2, cột 15',
    created_at: '2025-10-28T09:00:00',
    status: 'Mới',
  },
  { 
    id: 'SC002', 
    title: 'Thang máy sảnh B liên tục báo lỗi', 
    reported_by: 'Lê Gia Đình (B-205)',
    location: 'Thang máy B, Tòa B',
    created_at: '2025-10-27T14:30:00',
    status: 'Đang xử lý',
  },
  { 
    id: 'SC003', 
    title: 'Bóng đèn hành lang tầng 15 Tòa A bị cháy', 
    reported_by: 'Phạm Văn B (C-1503)',
    location: 'Hành lang Tầng 15, Tòa A',
    created_at: '2025-10-27T11:00:00',
    status: 'Hoàn thành',
  },
  { 
    id: 'SC004', 
    title: 'Tiếng ồn lạ từ máy phát điện', 
    reported_by: 'Hoàng Thị C (D-404)',
    location: 'Phòng kỹ thuật, Tầng G',
    created_at: '2025-10-26T22:00:00',
    status: 'Mới',
  },
];

// --- ĐỊNH NGHĨA CỘT (THEO TƯ VẤN) ---
const columns: GridColDef[] = [
  { field: 'id', headerName: 'Mã SC', width: 90 },
  { 
    field: 'status', 
    headerName: 'Trạng thái', 
    width: 130,
    renderCell: (params) => {
      const status = params.value as ReportStatus;
      let color: "error" | "warning" | "success" | "default" = "error";
      if (status === 'Đang xử lý') color = 'warning';
      if (status === 'Hoàn thành') color = 'success';
      if (status === 'Đã hủy') color = 'default';
      
      return <Chip label={status} color={color} size="small" />;
    }
  },
  { field: 'title', headerName: 'Tiêu đề', flex: 1, minWidth: 250 },
  { field: 'reported_by', headerName: 'Người báo cáo', width: 180 },
  { field: 'location', headerName: 'Vị trí', width: 180 },
  { 
    field: 'created_at', 
    headerName: 'Ngày báo cáo', 
    width: 160,
    type: 'dateTime',
    valueGetter: (value) => new Date(value),
    valueFormatter: (value: Date) => 
      value.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
  },
  {
    field: 'actions',
    headerName: 'Hành động',
    width: 120,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      const navigate = useNavigate();
      return (
        <Box>
          <Tooltip title="Xem chi tiết / Xử lý">
            <IconButton size="small" onClick={() => navigate(`/bod/report/list/detail/${params.row.id}`)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Đánh dấu Hoàn thành nhanh">
            <IconButton 
              size="small" 
              onClick={() => alert(`Hoàn thành: ${params.row.id}`)}
              disabled={params.row.status === 'Hoàn thành'}
            >
              <TaskAltIcon />
            </IconButton>
          </Tooltip>
        </Box>
      );
    }
  }
];

export default function ReportList() {
    const windowWidth = useWindowWidth();
      
        // 2. LẤY STATE TỪ CONTEXT
        const { isSidebarCollapsed } = useLayout(); 
      
        // 3. TÍNH TOÁN
        const dynamicPaperWidth = windowWidth 
                                  - (isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_OPEN) 
                                  - PAGE_PADDING;
                                  
  return (
    <>
      {/* --- 1. TIÊU ĐỀ --- */}
      <Grid container spacing={2}>
        <Grid sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            DANH SÁCH SỰ CỐ
            </Typography>
        </Grid>

        <Grid>
            <Paper sx={{ 
                height: '100%', 
                width: dynamicPaperWidth, 
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
            }}>
                <DataGrid
                    rows={mockReports}
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
                        minWidth: '900px', 
                    }}
                />
            </Paper>
        </Grid>
        
      </Grid>
    </>
  );
}