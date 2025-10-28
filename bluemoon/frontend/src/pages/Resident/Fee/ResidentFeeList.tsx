// src/pages/Resident/Fee/ResidentFeeList.tsx
import { Box, Typography, Paper, Chip, IconButton, Tooltip, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaymentIcon from '@mui/icons-material/Payment';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../../api/axiosClient';
import { format, parseISO } from 'date-fns'; // Thêm parseISO

// Định nghĩa kiểu dữ liệu trả về từ API (khớp với backend Invoice.findForUser)
interface ResidentInvoice {
  invoice_id: number;
  fee_name: string;
  description: string | null;
  due_date: string; // ISO string 'YYYY-MM-DD...'
  total_amount: number;
  amount_remaining: number;
  status: 'Chưa thanh toán' | 'Đã thanh toán' | 'Quá hạn' | 'Đã hủy';
  // Thêm các trường khác nếu API trả về
}

// Hàm gọi API lấy danh sách hóa đơn của tôi
const fetchMyInvoices = async (): Promise<ResidentInvoice[]> => {
  const { data } = await axiosClient.get('/api/invoices');
  // API backend trả về mảng trực tiếp từ model
  return data;
};

// Định nghĩa lại kiểu Status cho cư dân (có thể bỏ 'Đã hủy')
type FeeStatusResident = 'Chưa thanh toán' | 'Đã thanh toán' | 'Quá hạn';

export default function ResidentFeeList() {
 const navigate = useNavigate();

 const { data: invoices, isLoading, error } = useQuery<ResidentInvoice[], Error>({
   queryKey: ['myInvoices'],
   queryFn: fetchMyInvoices,
 });

 const columns: GridColDef<ResidentInvoice>[] = [
    { field: 'invoice_id', headerName: 'Mã HĐ', width: 100 },
    { field: 'fee_name', headerName: 'Loại phí', width: 130 }, // Sử dụng fee_name từ API
    { field: 'description', headerName: 'Nội dung', flex: 1, minWidth: 220 },
    {
        field: 'due_date',
        headerName: 'Hạn TT',
        width: 120,
        type: 'date',
        // Chuyển đổi ISO string sang Date object
        valueGetter: (value) => value ? parseISO(value) : null,
        renderCell: (params: GridRenderCellParams<any, Date | null>) => (
           params.value ? format(params.value, 'dd/MM/yyyy') : ''
        )
    },
    {
        field: 'total_amount',
        headerName: 'Tổng tiền',
        width: 130,
        type: 'number',
        valueFormatter: (value: number | null) => (value != null ? value.toLocaleString('vi-VN') + ' đ' : '0 đ')
    },
    {
        field: 'amount_remaining',
        headerName: 'Còn nợ',
        width: 130,
        type: 'number',
        renderCell: (params: GridRenderCellParams<any, number | null | undefined>) => {
            const value = params.value ?? 0;
            return (
                <Typography color={value > 0 ? 'error' : 'inherit'} fontWeight={value > 0 ? 'bold' : 'normal'}>
                    {value.toLocaleString('vi-VN')} đ
                </Typography>
            );
        }
    },
    {
        field: 'status',
        headerName: 'Trạng thái',
        width: 150,
        renderCell: (params: GridRenderCellParams<any, FeeStatusResident>) => { // Dùng FeeStatusResident
            const status = params.value;
            let color: "success" | "warning" | "error" = "success";
            if (status === 'Chưa thanh toán') color = 'warning';
            if (status === 'Quá hạn') color = 'error';
             // Bỏ qua nếu là 'Đã hủy' hoặc không hợp lệ
            if (!status || (status !== 'Chưa thanh toán' && status !== 'Đã thanh toán' && status !== 'Quá hạn')) {
                 return null;
            }
            return <Chip label={status} color={color} size="small" />;
        }
    },
    {
        field: 'actions',
        headerName: 'Hành động',
        width: 120,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams<any, any, ResidentInvoice>) => { // Truyền ResidentInvoice vào generic thứ 3
            const status = params.row.status as FeeStatusResident | 'Đã hủy' | undefined; // Lấy status từ row
            const needsPayment = status === 'Chưa thanh toán' || status === 'Quá hạn';
            return (
                <Box>
                    <Tooltip title="Xem chi tiết">
                        {/* Dùng invoice_id */}
                        <IconButton size="small" onClick={() => navigate(`/resident/fee/invoice_info/${params.row.invoice_id}`)}>
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={needsPayment ? "Thanh toán" : "Đã thanh toán"}>
                        <span>
                        <IconButton
                            size="small"
                            // Dùng invoice_id
                            onClick={() => navigate(`/resident/fee/payment/${params.row.invoice_id}`)}
                            disabled={!needsPayment}
                            color={needsPayment ? "primary" : "default"}
                        >
                            <PaymentIcon />
                        </IconButton>
                        </span>
                    </Tooltip>
                </Box>
            );
        }
    }
];

 return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            Công nợ & Phí Dịch vụ
        </Typography>

        {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        )}
        {/* Sửa thông báo lỗi */}
        {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
                Không thể tải danh sách công nợ: {error.message || 'Lỗi không xác định'}
            </Alert>
        )}
        {!isLoading && !error && invoices && (
             <Box sx={{ height: '65vh', width: '100%' }}>
                <DataGrid
                    rows={invoices}
                    columns={columns}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                        sorting: {
                            sortModel: [{ field: 'due_date', sort: 'asc' }],
                        },
                    }}
                    pageSizeOptions={[10, 20, 50]}
                    disableRowSelectionOnClick
                    // Cập nhật getRowId
                    getRowId={(row) => row.invoice_id}
                    sx={{ border: 0 }}
                />
            </Box>
        )}
         {!isLoading && !error && (!invoices || invoices.length === 0) && (
             <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                 Bạn không có công nợ nào cần thanh toán.
             </Typography>
         )}
    </Paper>
  );
}