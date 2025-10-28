// src/pages/Resident/Fee/ResidentFeeInvoiceInfo.tsx
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentIcon from '@mui/icons-material/Payment';
import { format } from 'date-fns'; // <-- Thêm dòng này
// (Thư viện Print/PDF nếu bạn muốn cư dân cũng có thể in/lưu)
// import PrintIcon from '@mui/icons-material/Print';
// import SaveAltIcon from '@mui/icons-material/SaveAlt';
// import { useReactToPrint } from 'react-to-print';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

// (Logo của bạn)
// import logoBluemoon from '../../../assets/bluemoon-logo.png';

// --- Mock Data (Thay bằng API call lấy chi tiết hóa đơn theo ID) ---
const mockInvoiceDetail: { [key: string]: any } = {
  'HD0001': {
    id: 'HD0001', so: '0001234', ngay: '28/10/2025',
    residentName: 'Trần Văn Hộ', apartment: 'A-101', paymentMethod: 'Chuyển khoản',
    items: [ { stt: 1, name: 'Phí Quản lý T10/2025', dvt: 'Tháng', sl: 1, don_gia: 1200000, thanh_tien: 1200000 } ],
    total: 1200000, totalInWords: 'Một triệu hai trăm nghìn đồng chẵn.', status: 'Đã thanh toán',
  },
  'HD0002': {
     id: 'HD0002', so: '0001235', ngay: '28/10/2025',
     residentName: 'Trần Văn Hộ', apartment: 'A-101', paymentMethod: 'Chuyển khoản',
     items: [ { stt: 1, name: 'Phí Gửi xe T10/2025 (Xe 29A-12345)', dvt: 'Tháng', sl: 1, don_gia: 1000000, thanh_tien: 1000000 } ],
     total: 1000000, totalInWords: 'Một triệu đồng chẵn.', status: 'Chưa thanh toán',
     dueDate: '2025-10-15', // Thêm hạn thanh toán
  },
};

export default function ResidentFeeInvoiceInfo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef<HTMLDivElement>(null); // Ref cho in/pdf (nếu cần)

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        if (id && mockInvoiceDetail[id]) {
            setInvoice(mockInvoiceDetail[id]);
        } else {
            // Xử lý không tìm thấy -> quay về list
            navigate('/resident/fee/list');
        }
        setLoading(false);
    }, 300); // Giả lập độ trễ
  }, [id, navigate]);

  // --- Logic In/PDF (Nếu bạn muốn thêm cho Cư dân) ---
  // const handlePrint = useReactToPrint({ content: () => invoiceRef.current });
  // const handleSavePdf = async () => { /* ... (logic jspdf + html2canvas) ... */ };

  const needsPayment = invoice?.status === 'Chưa thanh toán' || invoice?.status === 'Quá hạn';

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Đang tải chi tiết phiếu báo phí...</Typography>
      </Paper>
    );
  }

  if (!invoice) return null; // Trường hợp không tìm thấy đã navigate đi

  return (
    <>
      {/* KHUNG A4 */}
      <Paper
        ref={invoiceRef} // Gán ref nếu dùng in/pdf
        elevation={3}
        sx={{
          width: '210mm',
          minHeight: '270mm', // Có thể giảm chiều cao nếu không cần chữ ký
          margin: '2rem auto',
          padding: '15mm',
          position: 'relative',
          fontSize: '11pt',
          fontFamily: '"Times New Roman", Times, serif',
          // Watermark
          '&::before': {
            content: '""', position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            // backgroundImage: `url(${logoBluemoon})`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
            backgroundSize: 'contain', width: '70%', height: '70%',
            opacity: 0.08, zIndex: 0,
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Grid container justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
            <Grid>
              {/* <img src={logoBluemoon} alt="Logo" style={{ width: 100, marginBottom: '8px' }} /> */}
               <Typography variant="h6" sx={{fontWeight: 'bold'}}>BLUEMOON</Typography>
              <Typography variant="body2">Ban Quản Lý Chung Cư</Typography>
              <Typography variant="body2">Địa chỉ: 123 Đường ABC, P.XYZ, Q.1, TP.HCM</Typography>
            </Grid>
            <Grid sx={{textAlign: 'right'}}>
              <Typography variant="h5" sx={{fontWeight: 'bold'}}>PHIẾU BÁO PHÍ DỊCH VỤ</Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                Ngày {invoice.ngay.split('/')[0]} tháng {invoice.ngay.split('/')[1]} năm {invoice.ngay.split('/')[2]}
              </Typography>
              <Typography variant="body2">Số: {invoice.so}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }}/>

          {/* Thông tin Cư dân */}
          <Typography sx={{ fontWeight: 'bold' }}>Kính gửi Ông/Bà:</Typography>
          <Typography sx={{ ml: 2 }}>{invoice.residentName}</Typography>
          <Typography sx={{ fontWeight: 'bold' }}>Căn hộ:</Typography>
          <Typography sx={{ ml: 2 }}>{invoice.apartment}</Typography>
          {invoice.dueDate && (
             <>
                <Typography sx={{ fontWeight: 'bold', mt: 1 }}>Hạn thanh toán:</Typography>
                <Typography sx={{ ml: 2, color: needsPayment ? 'error.main' : 'inherit', fontWeight: needsPayment ? 'bold': 'normal' }}>
                    {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}
                </Typography>
             </>
          )}

          {/* Bảng Chi tiết Phí */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>Chi tiết các khoản phí:</Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ccc' }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f4f6f8' }}>
                 <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                    <TableCell>STT</TableCell>
                    <TableCell>Nội dung</TableCell>
                    <TableCell>ĐVT</TableCell>
                    <TableCell align="right">Số lượng</TableCell>
                    <TableCell align="right">Đơn giá</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                </TableRow>
              </TableHead>
               <TableBody>
                {invoice.items.map((item: any) => (
                    <TableRow key={item.stt}>
                        <TableCell>{item.stt}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.dvt}</TableCell>
                        <TableCell align="right">{item.sl}</TableCell>
                        <TableCell align="right">{item.don_gia.toLocaleString('vi-VN')}</TableCell>
                        <TableCell align="right">{item.thanh_tien.toLocaleString('vi-VN')}</TableCell>
                    </TableRow>
                ))}
                 {/* Dòng Tổng cộng */}
                 <TableRow sx={{ '& td': { fontWeight: 'bold', borderTop: '1px solid #ccc'} }}>
                     <TableCell colSpan={5} align="right">Tổng cộng:</TableCell>
                     <TableCell align="right">{invoice.total.toLocaleString('vi-VN')} đ</TableCell>
                 </TableRow>
               </TableBody>
            </Table>
          </TableContainer>

          <Typography sx={{ mt: 2 }}>Bằng chữ: {invoice.totalInWords}</Typography>

          {/* Trạng thái */}
          <Typography sx={{ mt: 3, fontWeight: 'bold' }}>
            Trạng thái:{' '}
            <Typography component="span" sx={{ color: needsPayment ? 'warning.main' : 'success.main', fontStyle: 'italic' }}>
                {invoice.status}
            </Typography>
          </Typography>

          {/* Thông tin thêm (tùy chọn) */}
          <Typography variant="body2" sx={{ mt: 4, fontStyle: 'italic', color: 'text.secondary' }}>
            Quý cư dân vui lòng thanh toán trước hạn. Mọi thắc mắc xin liên hệ Văn phòng BQL. Xin cảm ơn!
          </Typography>
        </Box>
      </Paper>

      {/* Nút chức năng */}
       <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 3, position: 'sticky', bottom: 16 }}>
         <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/resident/fee/list')}>
          Quay lại Danh sách Phí
        </Button>
        {/* Optional Buttons */}
        {/* <Button variant="contained" color="secondary" startIcon={<SaveAltIcon />} onClick={handleSavePdf}>Lưu PDF</Button> */}
        {/* <Button variant="contained" color="secondary" startIcon={<PrintIcon />} onClick={handlePrint}>In Phiếu</Button> */}
        {needsPayment && ( // Chỉ hiển thị nút Thanh toán nếu chưa thanh toán
            <Button
              variant="contained"
              color="primary"
              startIcon={<PaymentIcon />}
              onClick={() => navigate(`/resident/fee/payment/${id}`)}
            >
              Xem Thông tin Thanh toán
            </Button>
        )}
      </Box>
    </>
  );
}