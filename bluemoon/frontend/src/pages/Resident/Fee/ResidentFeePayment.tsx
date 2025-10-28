// src/pages/Resident/Fee/ResidentFeePayment.tsx
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Alert,
  CircularProgress, // <-- Thêm Loading
  Stack, // <-- Để căn chỉnh
  //Link, // <-- Để hiển thị link nếu có
  Tooltip,
  IconButton,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; // <-- Thêm state, effect
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // <-- Icon copy
import toast, { Toaster } from 'react-hot-toast'; // <-- Thêm Toast

// --- Mock Data (Thay bằng API call) ---
// 1. Mock chi tiết hóa đơn (chỉ cần lấy loại phí và số tiền)
const mockInvoiceMiniData: { [key: string]: any } = {
  'HD0001': { feeType: 'Phí Quản lý', amount: 1200000, apartment: 'A-101', residentName: 'Trần Văn Hộ', period: 'T10' },
  'HD0002': { feeType: 'Phí Gửi xe', amount: 1000000, apartment: 'A-101', residentName: 'Trần Văn Hộ', period: 'T10' },
};

// 2. Mock thông tin thanh toán theo loại phí (giống trang PaymentSetupList)
const mockPaymentSetup: { [key: string]: any } = {
  'Phí Quản lý': {
    bankName: 'Vietcombank', accountNumber: '123456789012', accountName: 'BQL CHUNG CU BLUEMOON',
    transferContentTemplate: '[MaCanHo] - [Ten] - PQL T[Thang]', qrCodeUrl: '/path/to/qr-code-pql.png',
  },
  'Phí Gửi xe': {
    bankName: 'Techcombank', accountNumber: '987654321098', accountName: 'BQL XE BLUEMOON',
    transferContentTemplate: '[MaCanHo] - [Ten] - PhiGuiXe T[Thang]', qrCodeUrl: null, // Giả sử phí xe chưa có QR
  },
  // ...
};

export default function ResidentFeePayment() {
  const { id: invoiceId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState<any>(null); // TT Thanh toán
  const [invoiceInfo, setInvoiceInfo] = useState<any>(null); // TT Hóa đơn (loại phí, số tiền)
  const [generatedContent, setGeneratedContent] = useState(''); // Nội dung CK đã tạo
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // 1. Simulate Fetch Invoice Detail (lấy feeType, amount, resident info)
    const fetchedInvoice = invoiceId ? mockInvoiceMiniData[invoiceId] : null;

    if (fetchedInvoice) {
      setInvoiceInfo(fetchedInvoice);
      // 2. Simulate Fetch Payment Setup based on feeType
      const fetchedPaymentSetup = mockPaymentSetup[fetchedInvoice.feeType];

      if (fetchedPaymentSetup) {
        setPaymentInfo(fetchedPaymentSetup);
        // 3. Generate Transfer Content
        let content = fetchedPaymentSetup.transferContentTemplate || '';
        content = content.replace('[MaCanHo]', fetchedInvoice.apartment || '');
        content = content.replace('[Ten]', fetchedInvoice.residentName || '');
        content = content.replace('[Thang]', fetchedInvoice.period || ''); // Giả sử có kỳ thanh toán
        // (Thêm các biến khác nếu cần)
        setGeneratedContent(content);
      } else {
        // Handle case không tìm thấy cấu hình thanh toán cho loại phí này
        console.error(`Không tìm thấy cấu hình thanh toán cho loại phí: ${fetchedInvoice.feeType}`);
        // Có thể navigate về trang trước hoặc hiển thị lỗi
      }
    } else {
      // Handle case không tìm thấy hóa đơn
       navigate('/resident/fee/list');
    }
    setLoading(false);
  }, [invoiceId, navigate]);

  // --- Hàm Copy vào Clipboard ---
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Đã sao chép ${label}!`);
    }).catch(err => {
      toast.error('Không thể sao chép.');
      console.error('Lỗi sao chép:', err);
    });
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{mt: 1}}>Đang tải thông tin thanh toán...</Typography>
      </Paper>
    );
  }

   if (!paymentInfo || !invoiceInfo) {
      return (
         <Paper sx={{ p: 3, textAlign: 'center' }}>
             <Alert severity="error">Không thể tải thông tin thanh toán cho hóa đơn này.</Alert>
             <Button sx={{mt: 2}} onClick={() => navigate('/resident/fee/list')}>Quay lại</Button>
         </Paper>
      );
   }


  return (
    <>
      <Toaster position="top-center" /> {/* Để hiển thị toast */}
      <Paper sx={{ p: 3, borderRadius: 3, maxWidth: 800, margin: 'auto' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            Thanh toán Phí Dịch vụ
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 3 }}>
            Hóa đơn: #{invoiceId} - {invoiceInfo.feeType}
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
            Sử dụng thông tin dưới đây để thanh toán qua ứng dụng Ngân hàng hoặc Internet Banking. Vui lòng kiểm tra kỹ thông tin trước khi xác nhận giao dịch.
        </Alert>

        <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
            {/* Cột QR Code (Nếu có) */}
            {paymentInfo.qrCodeUrl && (
                <Grid size={{ xs: 12, md: 5 }} sx={{ textAlign: 'center', mb: { xs: 3, md: 0 } }}>
                     <Typography sx={{ fontWeight: 'medium', mb: 1 }}>Quét mã QR (VietQR / Mobile Banking)</Typography>
                     <Box
                        component="img"
                        src={paymentInfo.qrCodeUrl}
                        alt="QR Code"
                        sx={{
                            maxWidth: '100%',
                            maxHeight: 300, // Giới hạn chiều cao
                            border: '1px solid #eee',
                            borderRadius: 1,
                            objectFit: 'contain' // Đảm bảo QR không bị méo
                        }}
                     />
                     <Typography variant="caption" color="text.secondary" sx={{display: 'block', mt: 1}}>
                         Mã QR đã bao gồm Số tiền và Nội dung chuyển khoản.
                     </Typography>
                </Grid>
            )}

            {/* Cột Thông tin Chuyển khoản */}
            <Grid size={{ xs: 12, md: paymentInfo.qrCodeUrl ? 7 : 12 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Thông tin Chuyển khoản:</Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography><strong>Ngân hàng:</strong></Typography>
                        <Typography>{paymentInfo.bankName}</Typography>
                    </Box>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography><strong>Số tài khoản:</strong></Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ mr: 1 }}>{paymentInfo.accountNumber}</Typography>
                            <Tooltip title="Sao chép STK">
                                <IconButton size="small" onClick={() => copyToClipboard(paymentInfo.accountNumber, 'Số tài khoản')}>
                                    <ContentCopyIcon fontSize="inherit"/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography><strong>Chủ tài khoản:</strong></Typography>
                        <Typography>{paymentInfo.accountName}</Typography>
                    </Box>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography><strong>Số tiền:</strong></Typography>
                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ mr: 1, color: 'red', fontWeight: 'bold' }}>
                                {invoiceInfo.amount.toLocaleString('vi-VN')} VNĐ
                            </Typography>
                             <Tooltip title="Sao chép Số tiền">
                                <IconButton size="small" onClick={() => copyToClipboard(invoiceInfo.amount.toString(), 'Số tiền')}>
                                    <ContentCopyIcon fontSize="inherit"/>
                                </IconButton>
                            </Tooltip>
                         </Box>
                    </Box>

                     <Divider sx={{ pt: 1 }} />

                    <Typography sx={{ mt: 1 }}><strong>Nội dung chuyển khoản (BẮT BUỘC):</strong></Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                        <Typography sx={{ fontFamily: 'monospace', flexGrow: 1, mr: 1 }}>
                            {generatedContent}
                        </Typography>
                        <Tooltip title="Sao chép Nội dung">
                             <IconButton size="small" onClick={() => copyToClipboard(generatedContent, 'Nội dung')}>
                                <ContentCopyIcon fontSize="inherit"/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Alert severity="warning" variant="outlined" sx={{fontSize: '0.8rem'}}>
                        Sao chép và dán đúng nội dung này vào phần "Nội dung/Diễn giải" khi chuyển khoản.
                    </Alert>
                </Stack>
            </Grid>
        </Grid>

        {/* Nút Quay lại */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              // Quay lại trang chi tiết hóa đơn HOẶC trang danh sách phí
              onClick={() => navigate(invoiceId ? `/resident/fee/invoice_info/${invoiceId}` : '/resident/fee/list')}
            >
              Quay lại
            </Button>
             {/* Có thể thêm nút "Tôi đã thanh toán" để gửi thông báo cho kế toán */}
        </Box>
      </Paper>
    </>
  );
}