// src/pages/Resident/Report/ResidentReportList.tsx
import { Box, Typography, Paper, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import { useAuth } from '../../../contexts/AuthContext';
// import { useEffect, useState } from 'react';

type ReportStatusResident = 'Đã nộp' | 'Đang xử lý' | 'Hoàn thành' | 'Đã hủy'; // Statuses resident sees

// Mock data (Replace with API call GET /api/incidents/my)
const mockResidentReports: GridRowsProp = [
  { id: 'SC001', title: 'Vỡ ống nước khu vực hầm B2', location: 'Hầm B2, cột 15', created_at: '2025-10-28T09:00:00', status: 'Đã nộp' },
  { id: 'SC004', title: 'Tiếng ồn lạ từ máy phát điện', location: 'Phòng kỹ thuật, Tầng G', created_at: '2025-10-26T22:00:00', status: 'Đang xử lý' },
  // ... other reports by this resident
];

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Mã SC', width: 90 },
   {
    field: 'status', headerName: 'Trạng thái', width: 140,
    renderCell: (params) => {
      const status = params.value as ReportStatusResident;
      let color: "info" | "warning" | "success" | "default" = "info"; // Default to 'Đã nộp'
      if (status === 'Đang xử lý') color = 'warning';
      if (status === 'Hoàn thành') color = 'success';
      if (status === 'Đã hủy') color = 'default';
      return <Chip label={status} color={color} size="small" />;
    }
  },
  { field: 'title', headerName: 'Tiêu đề', flex: 1, minWidth: 250 },
  { field: 'location', headerName: 'Vị trí', width: 180 },
  {
    field: 'created_at', headerName: 'Ngày gửi', width: 160, type: 'dateTime',
    valueGetter: (value) => new Date(value),
    valueFormatter: (value: Date) => value.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
  },
  // No actions column needed for resident view typically
];

export default function ResidentReportList() {
  const navigate = useNavigate();
  // const { user } = useAuth();
  // const [reports, setReports] = useState<GridRowsProp>([]);
  // useEffect(() => { /* Fetch reports */ }, [user]);

  // Optional: Handle row click to show detail in a simple modal
  const handleRowClick = (params: any) => {
      alert(`Chi tiết ${params.row.id}:\n${params.row.title}\nTrạng thái: ${params.row.status}`);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Lịch sử Báo cáo Sự cố / Yêu cầu
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => navigate('/resident/report/send')}
            >
                Gửi Báo cáo Mới
            </Button>
        </Box>
         <Box sx={{ height: '70vh', width: '100%' }}>
            <DataGrid
                rows={mockResidentReports} // Use 'reports' state
                columns={columns}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                pageSizeOptions={[10, 20]}
                disableRowSelectionOnClick={false}
                onRowClick={handleRowClick} // Show simple detail on click
                getRowId={(row) => row.id}
                sx={{ border: 0, cursor: 'pointer' }}
            />
        </Box>
    </Paper>
  );
}