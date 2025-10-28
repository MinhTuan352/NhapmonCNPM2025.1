// src/pages/Accountant/Setup/PaymentSetupList.tsx
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack, // <-- Để sắp xếp nội dung trong Modal
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'; // <-- Icon cho nút Sửa

// --- Mock Data (Thay bằng API call) ---
const mockPaymentInfos = [
  {
    id: 'TT-PQL',
    feeId: 'PQL', // ID của Loại phí tương ứng
    feeName: 'Phí Quản lý',
    bankName: 'Vietcombank',
    accountNumber: '123456789012',
    accountName: 'BQL CHUNG CU BLUEMOON',
    transferContent: '[MaCanHo] - [Ten] - PQL T[Thang]',
    qrCodeUrl: '/path/to/qr-code-pql.png', // Đường dẫn tới ảnh QR (để trống nếu chưa có)
  },
  {
    id: 'TT-XEOTO',
    feeId: 'PXE-OTO',
    feeName: 'Phí Gửi xe Ô tô',
    bankName: 'Techcombank',
    accountNumber: '987654321098',
    accountName: 'BQL XE BLUEMOON',
    transferContent: '[MaCanHo] - [BienSoXe] - PhiGuiXe T[Thang]',
    qrCodeUrl: null, // Chưa có QR
  },
   {
    id: 'TT-NUOC',
    feeId: 'PNUOC',
    feeName: 'Phí Nước Sinh Hoạt',
    bankName: 'Vietcombank',
    accountNumber: '123456789012', // Có thể dùng chung STK
    accountName: 'BQL CHUNG CU BLUEMOON',
    transferContent: '[MaCanHo] - TienNuoc T[Thang]',
    qrCodeUrl: '/path/to/qr-code-pql.png',
  },
];

export default function PaymentSetupList() {
  const navigate = useNavigate();
  const [openDetailModal, setOpenDetailModal] = useState(false);
  // State để lưu thông tin chi tiết sẽ hiển thị trong Modal
  const [selectedPaymentInfo, setSelectedPaymentInfo] = useState<any>(null);

  // --- Handlers cho Modal ---
  const handleOpenDetail = (info: any) => {
    setSelectedPaymentInfo(info); // Lưu thông tin của thẻ được click
    setOpenDetailModal(true);
  };

  const handleCloseDetail = () => {
    setOpenDetailModal(false);
    setSelectedPaymentInfo(null); // Reset khi đóng
  };

  const handleNavigateToEdit = () => {
    if (selectedPaymentInfo) {
      navigate(`/accountance/fee/setup/paymentSetup/edit/${selectedPaymentInfo.id}`);
      handleCloseDetail(); // Đóng modal sau khi chuyển trang
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      {/* --- Hàng Tiêu đề và Nút Thêm --- */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Thiết lập Thông tin Thanh toán
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/accountance/fee/setup/paymentSetup/create')}
        >
          Thêm thông tin TT
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* --- Danh sách Thẻ Thông tin TT --- */}
      <Grid container spacing={3}>
        {mockPaymentInfos.map((info) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={info.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {info.feeName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  ID Cấu hình: {info.id}
                </Typography>
                <Typography sx={{ my: 1 }}>
                  <strong>Ngân hàng:</strong> {info.bankName}
                </Typography>
                <Typography>
                  <strong>STK:</strong> {info.accountNumber}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                {/* Nút mở Modal */}
                <Button size="small" onClick={() => handleOpenDetail(info)}>
                  Chi tiết
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* --- Modal Chi tiết Thông tin Thanh toán (Req 4.2) --- */}
      <Dialog open={openDetailModal} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Chi tiết Thông tin Thanh toán
        </DialogTitle>
        <DialogContent dividers> {/* Thêm dividers để ngăn cách */}
          {selectedPaymentInfo && ( // Chỉ render nội dung khi có data
            <Grid container spacing={2}>
              {/* Cột trái: QR Code */}
              <Grid size={{ xs: 12, sm: 5 }} sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Mã QR Thanh toán
                </Typography>
                {selectedPaymentInfo.qrCodeUrl ? (
                  <img
                    src={selectedPaymentInfo.qrCodeUrl}
                    alt={`QR Code for ${selectedPaymentInfo.feeName}`}
                    style={{ width: '100%', maxWidth: '250px', border: '1px solid #eee' }}
                  />
                ) : (
                  <Box sx={{ width: '100%', maxWidth: '250px', height: '250px', bgcolor: 'grey.200', margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Chưa có mã QR</Typography>
                  </Box>
                )}
              </Grid>

              {/* Cột phải: Thông tin chi tiết */}
              <Grid size={{ xs: 12, sm: 7 }}>
                <Stack spacing={1.5}> {/* Dùng Stack để dễ căn chỉnh */}
                  <Typography variant="h6">{selectedPaymentInfo.feeName}</Typography>
                  <Divider />
                  <Typography><strong>ID Cấu hình:</strong> {selectedPaymentInfo.id}</Typography>
                  <Typography><strong>Ngân hàng:</strong> {selectedPaymentInfo.bankName}</Typography>
                  <Typography><strong>Số tài khoản:</strong> {selectedPaymentInfo.accountNumber}</Typography>
                  <Typography><strong>Chủ tài khoản:</strong> {selectedPaymentInfo.accountName}</Typography>
                  <Divider />
                  <Typography><strong>Nội dung chuyển khoản (Gợi ý):</strong></Typography>
                  <Typography sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                    {selectedPaymentInfo.transferContent}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hướng dẫn cư dân sử dụng đúng nội dung để dễ đối soát. Các biến trong ngoặc vuông [] sẽ được thay thế tự động (nếu hệ thống hỗ trợ).
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}> {/* Căn chỉnh nút */}
          <Button onClick={handleCloseDetail}>
            Đóng
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleNavigateToEdit} // <-- Nút chỉnh sửa (Req 4.2)
          >
            Chỉnh sửa
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}