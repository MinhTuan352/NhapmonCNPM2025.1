// src/pages/Accountant/FeeManagement/AccountantFeeInvoice.tsx
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress, // <-- Thêm Loading
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react'; // <-- Thêm useRef
// Icons
import PrintIcon from '@mui/icons-material/Print';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// (Thêm logo của bạn vào src/assets)
// import logoBluemoon from '../../../assets/bluemoon-logo.png';

// --- Thư viện PDF/Print (Cần cài đặt) ---
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Mock Data (Thay bằng API call) ---
const mockInvoiceData: { [key: string]: any } = {
  'HD0001': {
    id: 'HD0001',
    kyhieu: 'BM/23E',
    so: '0001234',
    ngay: '28/10/2025',
    residentName: 'Trần Văn Hộ',
    residentId: 'R0001',
    apartment: 'A-101',
    address: '123 Đường ABC, Q.1, TP.HCM', // Địa chỉ cư dân (nếu có)
    mst: '0301234567', // Mã số thuế cư dân (nếu có)
    paymentMethod: 'Chuyển khoản',
    items: [
      { stt: 1, name: 'Phí Quản lý T10/2025', dvt: 'Tháng', sl: 1, don_gia: 1200000, thanh_tien: 1200000 },
    ],
    total: 1200000,
    totalInWords: 'Một triệu hai trăm nghìn đồng chẵn.',
    status: 'Đã thanh toán', // Trạng thái hóa đơn
  },
  'HD0002': {
    id: 'HD0002',
    kyhieu: 'BM/23E',
    so: '0001235',
    ngay: '28/10/2025',
    residentName: 'Trần Văn Hộ',
    residentId: 'R0001',
    apartment: 'A-101',
    address: '123 Đường ABC, Q.1, TP.HCM',
    mst: '0301234567',
    paymentMethod: 'Chuyển khoản',
    items: [
       { stt: 1, name: 'Phí Gửi xe T10/2025 (Xe 29A-12345)', dvt: 'Tháng', sl: 1, don_gia: 1000000, thanh_tien: 1000000 },
    ],
    total: 1000000,
    totalInWords: 'Một triệu đồng chẵn.',
    status: 'Chưa thanh toán',
  },
  // ... thêm các hóa đơn khác
};

export default function AccountantFeeInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [openSend, setOpenSend] = useState(false);
  const [isSavingPdf, setIsSavingPdf] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null); // Ref cho phần tử cần in/xuất PDF

  useEffect(() => {
    // Fetch data hóa đơn bằng 'id'
    if (id && mockInvoiceData[id]) {
      setInvoice(mockInvoiceData[id]);
    } else {
      // Xử lý không tìm thấy hóa đơn
      navigate('/accountance/fee/list'); // Hoặc trang 404
    }
  }, [id, navigate]);

  // --- CẬP NHẬT: Logic In (Dùng react-to-print) ---
  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `HoaDon_${invoice?.id || 'moi'}`, // Tên file khi in (tùy chọn)
    // Có thể thêm các callback onBeforeGetContent, onAfterPrint nếu cần
  });

  // --- CẬP NHẬT: Logic Lưu PDF (Dùng jspdf + html2canvas) ---
  const handleSavePdf = async () => {
    if (!invoiceRef.current) return;
    setIsSavingPdf(true); // Bắt đầu loading

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Tăng scale để chất lượng ảnh tốt hơn
        useCORS: true, // Nếu có ảnh từ nguồn khác
      });
      const imgData = canvas.toDataURL('image/png');

      // Kích thước A4 (mm)
      const pdfWidthMm = 210;
      const pdfHeightMm = 297;

      // Kích thước ảnh (pixel)
      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;

      // Tạo đối tượng PDF A4
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Tính toán tỷ lệ để fit ảnh vào trang A4 (giữ margin)
      const marginMm = 10; // Margin 10mm mỗi bên
      const usableWidthMm = pdfWidthMm - marginMm * 2;
      const usableHeightMm = pdfHeightMm - marginMm * 2;

      const ratio = Math.min(usableWidthMm / (imgWidthPx / 3.78), usableHeightMm / (imgHeightPx / 3.78)); // Chuyển px -> mm (ước lượng)
      const finalImgWidthMm = (imgWidthPx / 3.78) * ratio;
      const finalImgHeightMm = (imgHeightPx / 3.78) * ratio;

      // Canh giữa ảnh
      const imgX = (pdfWidthMm - finalImgWidthMm) / 2;
      const imgY = marginMm; // Bắt đầu từ margin top

      pdf.addImage(imgData, 'PNG', imgX, imgY, finalImgWidthMm, finalImgHeightMm);
      pdf.save(`HoaDon_${invoice?.id || 'moi'}.pdf`);

    } catch (error) {
        console.error("Lỗi khi tạo PDF:", error);
        alert('Đã xảy ra lỗi khi tạo file PDF.');
    } finally {
        setIsSavingPdf(false); // Kết thúc loading
    }
  };

  // --- Logic Gửi Hóa đơn ---
  const handleOpenSendModal = () => setOpenSend(true);
  const handleCloseSendModal = () => setOpenSend(false);
  const handleConfirmSend = () => {
      // Logic gửi email/thông báo kèm PDF (nếu có)
      alert('Đã gửi hóa đơn (Giả lập)');
      handleCloseSendModal();
  };

  if (!invoice) {
    return <Typography>Đang tải hóa đơn...</Typography>; // Hoặc loading spinner
  }

  return (
    <>
      {/* KHUNG A4 */}
      <Paper
        ref={invoiceRef} // Gán ref cho Paper để in/xuất PDF
        elevation={5}
        sx={{
          width: '210mm',
          minHeight: '297mm',
          margin: '2rem auto',
          padding: '15mm', // Tăng padding để giống hóa đơn thật
          position: 'relative',
          fontSize: '11pt', // Cỡ chữ phổ biến cho hóa đơn
          fontFamily: '"Times New Roman", Times, serif', // Font phổ biến
          // --- Watermark (Req 2) ---
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%', left: '50%',
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
              <Typography variant="body2">Đơn vị bán hàng: Ban Quản Lý Chung Cư Bluemoon</Typography>
              <Typography variant="body2">Địa chỉ: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM</Typography>
              <Typography variant="body2">Mã số thuế: 0123456789</Typography>
              <Typography variant="body2">Điện thoại: 028.xxxx.xxxx</Typography>
            </Grid>
            <Grid sx={{textAlign: 'right'}}>
              <Typography variant="body2">Mẫu số: 01GTKT0/001</Typography>
              <Typography variant="body2">Ký hiệu: {invoice.kyhieu}</Typography>
              <Typography variant="body2">Số: {invoice.so}</Typography>
              <Typography variant="h5" sx={{fontWeight: 'bold', mt: 1}}>HÓA ĐƠN DỊCH VỤ</Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Ngày {invoice.ngay.split('/')[0]} tháng {invoice.ngay.split('/')[1]} năm {invoice.ngay.split('/')[2]}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }}/>

          {/* Thông tin Khách hàng */}
          <Typography>Họ tên người mua hàng: {invoice.residentName}</Typography>
          <Typography>Tên đơn vị: Căn hộ {invoice.apartment}</Typography>
          <Typography>Mã số cư dân: {invoice.residentId}</Typography>
          <Typography>Địa chỉ: {invoice.address}</Typography>
          <Typography>Mã số thuế: {invoice.mst}</Typography>
          <Typography>Hình thức thanh toán: {invoice.paymentMethod}</Typography>

          {/* Bảng Hàng hóa */}
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ccc', my: 3 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f4f6f8' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tên hàng hóa, dịch vụ</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ĐVT</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Số lượng</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Đơn giá</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Thành tiền</TableCell>
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
                {/* Dòng trống để đủ layout */}
                {[...Array(5 - invoice.items.length)].map((_, i) => (
                  <TableRow key={`empty-${i}`} sx={{height: 35}}><TableCell colSpan={6}></TableCell></TableRow>
                ))}
                {/* Dòng tổng */}
                <TableRow sx={{ '& td': { border: 0 } }}>
                  <TableCell colSpan={4} />
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Cộng tiền hàng:</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">{invoice.total.toLocaleString('vi-VN')} đ</TableCell>
                </TableRow>
                {/* (Thêm các dòng Thuế suất, Tiền thuế GTGT nếu cần) */}
                <TableRow sx={{ '& td': { border: 0 } }}>
                  <TableCell colSpan={4} />
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Tổng cộng tiền thanh toán:</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">{invoice.total.toLocaleString('vi-VN')} đ</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography>Số tiền viết bằng chữ: {invoice.totalInWords}</Typography>

          {/* Chữ ký */}
          <Grid container justifyContent="space-between" sx={{ mt: 5 }}>
            <Grid size={5} sx={{textAlign: 'center'}}>
              <Typography sx={{ fontWeight: 'bold' }}>Người mua hàng</Typography>
              <Typography sx={{ fontStyle: 'italic' }}>(Ký, ghi rõ họ tên)</Typography>
              <Box sx={{height: 80}} /> {/* Khoảng trống ký */}
              <Typography>{invoice.residentName}</Typography>
            </Grid>
            <Grid size={5} sx={{textAlign: 'center'}}>
              <Typography sx={{ fontWeight: 'bold' }}>Người bán hàng</Typography>
              <Typography sx={{ fontStyle: 'italic' }}>(Ký, đóng dấu, ghi rõ họ tên)</Typography>
              <Box sx={{height: 80}} /> {/* Khoảng trống ký */}
              <Typography>[Tên người ký]</Typography>
              <Typography sx={{ color: 'green', fontWeight: 'bold', mt: 1 }}>[Đã ký điện tử]</Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* NÚT CHỨC NĂNG (Req 2) */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 3, position: 'sticky', bottom: 16 }}>
         <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/accountance/fee/list')}>
          Quay lại DS
        </Button>
        <Button 
        variant="contained" 
        color="secondary" 
        startIcon={isSavingPdf ? <CircularProgress size={20} color="inherit" /> : <SaveAltIcon />} 
        onClick={handleSavePdf}>
          {isSavingPdf ? 'Đang lưu...' : 'Lưu PDF'}
        </Button>
        <Button variant="contained" color="secondary" startIcon={<PrintIcon />} onClick={handlePrint}>In hóa đơn</Button>
        <Button variant="contained" color="info" startIcon={<SendIcon />} onClick={handleOpenSendModal}>Gửi hóa đơn</Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/accountance/fee/list/invoice/edit/${id}`)}
        >
          Cập nhật
        </Button>
      </Box>

      {/* Modal Gửi Hóa đơn */}
      <Dialog open={openSend} onClose={handleCloseSendModal} fullWidth maxWidth="xs">
        <DialogTitle>Gửi Hóa đơn qua Email</DialogTitle>
        <DialogContent>
          <TextField
            label="Email nhận"
            type="email"
            fullWidth
            sx={{ mt: 1 }}
            defaultValue="chuho.a@bluemoon.com" // Lấy email từ data cư dân
          />
          <TextField label="Thông tin gửi kèm (Tùy chọn)" multiline rows={3} fullWidth sx={{ mt: 2 }} placeholder="Ví dụ: Kính gửi anh/chị..., BQL xin gửi hóa đơn phí..." />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSendModal}>Hủy</Button>
          <Button onClick={handleConfirmSend} variant="contained" startIcon={<SendIcon />}>Gửi</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}