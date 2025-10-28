// src/pages/Resident/Notification/ResidentNotificationList.tsx
import { Box, Typography, Paper, Chip, IconButton, Tooltip } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import { DataGrid, type GridColDef, type GridRowsProp, type GridCellParams } from '@mui/x-data-grid';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
// import { useAuth } from '../../../contexts/AuthContext';
// import { useEffect, useState } from 'react';

// Mock Data (Replace with API call /api/notifications/my)
const mockResidentNotifications: GridRowsProp = [
  { id: 'TB001', title: 'Thông báo lịch cắt điện Tòa A', sent_by: 'BQL Nguyễn Văn A', created_at: '2025-10-28T10:30:00', status: 'Đã đọc', read_at: '2025-10-28T11:00:00', content: '...' },
  { id: 'TB002', title: 'Thông báo họp tổ dân phố Quý 4', sent_by: 'BQL Trần Thị B', created_at: '2025-10-27T15:00:00', status: 'Đã gửi', read_at: null, content: '...' },
  { id: 'TB004', title: 'Thông báo lịch phun thuốc muỗi', sent_by: 'BQL Nguyễn Văn A', created_at: '2025-10-24T11:00:00', status: 'Đã gửi', read_at: null, content: '...' },
];

const columns: GridColDef[] = [
  // ID is needed for actions but can be hidden if desired
  // { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'status', headerName: 'Trạng thái', width: 120,
    renderCell: (params) => {
        const isRead = params.value === 'Đã đọc';
        return <Chip label={isRead ? 'Đã đọc' : 'Chưa đọc'} color={isRead ? 'default' : 'warning'} size="small" variant={isRead ? 'outlined' : 'filled'}/>;
    }
  },
  { field: 'title', headerName: 'Tiêu đề', flex: 1, minWidth: 250 },
  { field: 'sent_by', headerName: 'Người gửi', width: 180 },
  {
    field: 'created_at', headerName: 'Ngày gửi', width: 160, type: 'dateTime',
    valueGetter: (value) => new Date(value),
    valueFormatter: (value: Date) => value.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
  },
  {
    field: 'actions', headerName: 'Hành động', width: 100, sortable: false,
    renderCell: (params: GridCellParams) => {
      const isRead = params.row.status === 'Đã đọc';
      const handleMarkRead = () => {
          // Call API PUT /api/notifications/read/:id
          alert(`Đánh dấu đã đọc: ${params.row.id}`);
          // Need to update the state/refetch data after API call
      };
      return (
        <Tooltip title={isRead ? "Đã đọc" : "Đánh dấu đã đọc"}>
            <span> {/* Wrapper for disabled */}
            <IconButton size="small" onClick={handleMarkRead} disabled={isRead}>
                {isRead ? <MarkEmailReadIcon /> : <MarkEmailUnreadIcon color="warning"/>}
            </IconButton>
            </span>
        </Tooltip>
      );
    }
  }
];

export default function ResidentNotificationList() {
  // const { user } = useAuth();
  // const [notifications, setNotifications] = useState<GridRowsProp>([]);
  // useEffect(() => { /* Fetch notifications */ }, [user]);

  // Handle row click to show detail (e.g., in a modal or separate page)
  const handleRowClick = (params: any) => {
      alert(`Xem chi tiết: ${params.row.id}\nNội dung: ${params.row.content}`);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            Hòm thư Thông báo
        </Typography>
         <Box sx={{ height: '70vh', width: '100%' }}>
            <DataGrid
                rows={mockResidentNotifications} // Use 'notifications' state
                columns={columns}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                pageSizeOptions={[10, 20]}
                disableRowSelectionOnClick={false} // Allow row click
                onRowClick={handleRowClick} // Show detail on click
                getRowId={(row) => row.id} // Ensure correct ID is used
                sx={{ border: 0, cursor: 'pointer' }}
            />
        </Box>
    </Paper>
  );
}