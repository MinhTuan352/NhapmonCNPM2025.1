// src/pages/Accountant/Setup/PaymentSetupEdit.tsx
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  //Tooltip,
  InputAdornment,
  Divider,
  type SelectChangeEvent,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef, type ChangeEvent } from 'react';
//import InfoIcon from '@mui/icons-material/Info';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// --- Mock Data Loại Phí (Thay bằng API call) ---
const mockFeeTypesForSelect = [
  { id: 'PQL', name: 'Phí Quản lý' },
  { id: 'PXE-OTO', name: 'Phí Gửi xe Ô tô' },
  { id: 'PXE-MAY', name: 'Phí Gửi xe Máy' },
  { id: 'PNUOC', name: 'Phí Nước Sinh Hoạt' },
  { id: 'PSC', name: 'Phí Sửa chữa Chung' },
];

// --- Mock Data Chi tiết TT (Thay bằng API call) ---
const mockPaymentInfoData: { [key: string]: any } = {
  'TT-PQL': {
    id: 'TT-PQL', feeId: 'PQL', feeName: 'Phí Quản lý', bankName: 'Vietcombank',
    accountNumber: '123456789012', accountName: 'BQL CHUNG CU BLUEMOON',
    transferContent: '[MaCanHo] - [Ten] - PQL T[Thang]', qrCodeUrl: '/path/to/qr-code-pql.png',
  },
  'TT-XEOTO': {
     id: 'TT-XEOTO', feeId: 'PXE-OTO', feeName: 'Phí Gửi xe Ô tô', bankName: 'Techcombank',
     accountNumber: '987654321098', accountName: 'BQL XE BLUEMOON',
     transferContent: '[MaCanHo] - [BienSoXe] - PhiGuiXe T[Thang]', qrCodeUrl: null,
  },
  // ...
};

export default function PaymentSetupEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // --- State cho Form ---
  const [paymentData, setPaymentData] = useState<any>(null);
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null); // Để xem trước ảnh QR cũ
  const qrInputRef = useRef<HTMLInputElement>(null);

  // --- Fetch Data ---
  useEffect(() => {
    if (id && mockPaymentInfoData[id]) {
      const data = mockPaymentInfoData[id];
      setPaymentData(data);
      setQrCodePreview(data.qrCodeUrl); // Lưu link ảnh QR cũ (nếu có)
    } else {
      navigate('/accountance/fee/setup/paymentSetup');
    }
  }, [id, navigate]);

  const handleUpdate = () => {
    // Logic gọi API cập nhật TT Thanh toán với 'id' và 'paymentData', 'qrCodeFile' (nếu có)
    alert(`Đã cập nhật TT Thanh toán ${id} (Giả lập)`);
    navigate('/accountance/fee/setup/paymentSetup');
  };

  // --- Hàm cập nhật state khi form thay đổi ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setPaymentData((prev: any) => ({ ...prev, [name]: value }));
  };

  // --- Handlers cho Upload QR ---
  const handleQrUploadClick = () => {
    qrInputRef.current?.click();
  };

  const handleQrFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQrCodeFile(e.target.files[0]);
      setQrCodePreview(URL.createObjectURL(e.target.files[0])); // Tạo URL xem trước cho ảnh mới
    }
     e.target.value = '';
  };

  if (!paymentData) {
    return <Typography>Đang tải...</Typography>;
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 700, margin: 'auto', borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        Chỉnh sửa Thông tin Thanh toán (Mã: {id})
      </Typography>

      {/* Input file ẩn cho QR */}
      <input
        type="file" ref={qrInputRef} onChange={handleQrFileSelected}
        style={{ display: 'none' }} accept="image/png, image/jpeg"
      />

      <Grid container spacing={3}>
        {/* ID Cấu hình (Không sửa) */}
        <Grid size={12}>
          <TextField label="Mã Cấu hình TT" fullWidth value={paymentData.id} InputProps={{ readOnly: true }} />
        </Grid>

        {/* Áp dụng cho Loại phí */}
        <Grid size={12}>
          <FormControl fullWidth required>
            <InputLabel>Áp dụng cho Loại phí</InputLabel>
            <Select
              label="Áp dụng cho Loại phí"
              name="feeId"
              value={paymentData.feeId}
              onChange={handleChange}
            >
              {mockFeeTypesForSelect.map(fee => (
                <MenuItem key={fee.id} value={fee.id}>{fee.name} ({fee.id})</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={12}> <Divider sx={{ my: 1 }} /> </Grid>

        {/* Thông tin Ngân hàng */}
        <Grid size={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>Thông tin Ngân hàng</Typography>
        </Grid>
        <Grid size={12}>
          <TextField
            label="Tên Ngân hàng" name="bankName" fullWidth required
            value={paymentData.bankName} onChange={handleChange}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            label="Số tài khoản" name="accountNumber" fullWidth required
            value={paymentData.accountNumber} onChange={handleChange}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            label="Tên Chủ tài khoản" name="accountName" fullWidth required
            value={paymentData.accountName} onChange={handleChange}
          />
        </Grid>

        <Grid size={12}> <Divider sx={{ my: 1 }} /> </Grid>

        {/* Nội dung và QR */}
         <Grid size={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>Nội dung chuyển khoản & Mã QR</Typography>
        </Grid>
        <Grid size={12}>
          <TextField
            label="Nội dung chuyển khoản (Gợi ý cho Cư dân)"
            name="transferContent" fullWidth required
            value={paymentData.transferContent} onChange={handleChange}
            helperText="Sử dụng [MaCanHo], [Ten], [Thang], [Nam], [MaHD] để tạo mẫu nội dung."
          />
        </Grid>
        <Grid size={12}>
           {/* Hiển thị ảnh QR hiện tại (nếu có) */}
           {qrCodePreview && (
             <Box sx={{mb: 1}}>
                <Typography variant="caption">Ảnh QR hiện tại:</Typography>
                <img src={qrCodePreview} alt="QR Code Preview" style={{display: 'block', maxWidth: '150px', maxHeight: '150px', border: '1px solid #eee'}}/>
             </Box>
           )}
          <TextField
            label="Mã QR Thanh toán"
            fullWidth
            value={qrCodeFile ? qrCodeFile.name : (paymentData.qrCodeUrl ? 'Giữ ảnh cũ' : 'Chưa có ảnh')}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="outlined" size="small"
                    startIcon={<UploadFileIcon />}
                    onClick={handleQrUploadClick}
                  >
                    {qrCodePreview ? 'Đổi ảnh' : 'Chọn ảnh'}
                  </Button>
                </InputAdornment>
              ),
            }}
            helperText="Chọn ảnh mới để thay thế ảnh QR hiện tại (nếu có)."
          />
        </Grid>

      </Grid>

      {/* Nút Cập nhật và Hủy */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button onClick={() => navigate('/accountance/fee/setup/paymentSetup')}>
          Hủy
        </Button>
        <Button variant="contained" onClick={handleUpdate}>
          Cập nhật
        </Button>
      </Box>
    </Paper>
  );
}