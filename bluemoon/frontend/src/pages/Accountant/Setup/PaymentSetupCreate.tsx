// src/pages/Accountant/Setup/PaymentSetupCreate.tsx
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
  Tooltip,
  InputAdornment, // <-- Để thêm icon vào TextField
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, type ChangeEvent } from 'react'; // <-- Thêm state, ref
import InfoIcon from '@mui/icons-material/Info';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // <-- Icon Upload

// --- Mock Data Loại Phí (Thay bằng API call) ---
const mockFeeTypesForSelect = [
  { id: 'PQL', name: 'Phí Quản lý' },
  { id: 'PXE-OTO', name: 'Phí Gửi xe Ô tô' },
  { id: 'PXE-MAY', name: 'Phí Gửi xe Máy' },
  { id: 'PNUOC', name: 'Phí Nước Sinh Hoạt' },
  { id: 'PSC', name: 'Phí Sửa chữa Chung' },
];

export default function PaymentSetupCreate() {
  const navigate = useNavigate();
  const [selectedFeeId, setSelectedFeeId] = useState('');
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    // Logic gọi API tạo TT Thanh toán mới
    alert('Đã tạo Thông tin Thanh toán mới (Giả lập)');
    navigate('/accountance/fee/setup/paymentSetup');
  };

  // --- Handlers cho Upload QR ---
  const handleQrUploadClick = () => {
    qrInputRef.current?.click();
  };

  const handleQrFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQrCodeFile(e.target.files[0]);
    }
     e.target.value = ''; // Reset để có thể chọn lại
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 700, margin: 'auto', borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        Thêm Thông tin Thanh toán Mới
      </Typography>

      {/* Input file ẩn cho QR */}
      <input
        type="file"
        ref={qrInputRef}
        onChange={handleQrFileSelected}
        style={{ display: 'none' }}
        accept="image/png, image/jpeg" // Chỉ chấp nhận ảnh
      />

      <Grid container spacing={3}>
        {/* ID Cấu hình (Tự tạo hoặc nhập tay) */}
        <Grid size={12}>
          <TextField
            label="Mã Cấu hình TT (Viết liền, không dấu)"
            fullWidth
            required
            helperText="Ví dụ: TT-PQL, TT-XEOTO. Dùng để liên kết và quản lý."
             InputProps={{
              endAdornment: (
                <Tooltip title="Mã này giúp phân biệt các cấu hình thanh toán khác nhau.">
                  <InfoIcon color="action" sx={{ cursor: 'help' }} />
                </Tooltip>
              )
            }}
          />
        </Grid>

        {/* Áp dụng cho Loại phí */}
        <Grid size={12}>
          <FormControl fullWidth required>
            <InputLabel>Áp dụng cho Loại phí</InputLabel>
            <Select
              label="Áp dụng cho Loại phí"
              value={selectedFeeId}
              onChange={(e) => setSelectedFeeId(e.target.value)}
            >
              {mockFeeTypesForSelect.map(fee => (
                <MenuItem key={fee.id} value={fee.id}>{fee.name} ({fee.id})</MenuItem>
              ))}
            </Select>
            <Typography variant="caption" sx={{ mt: 0.5, ml: 1.5, color: 'text.secondary' }}>
              Chọn loại phí mà thông tin thanh toán này sẽ được sử dụng.
            </Typography>
          </FormControl>
        </Grid>

        <Grid size={12}> <Divider sx={{ my: 1 }} /> </Grid>

        {/* Thông tin Ngân hàng */}
        <Grid size={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>Thông tin Ngân hàng</Typography>
        </Grid>
        <Grid size={12}>
          <TextField label="Tên Ngân hàng" fullWidth required />
        </Grid>
        <Grid size={6}>
          <TextField label="Số tài khoản" fullWidth required />
        </Grid>
        <Grid size={6}>
          <TextField label="Tên Chủ tài khoản" fullWidth required />
        </Grid>

        <Grid size={12}> <Divider sx={{ my: 1 }} /> </Grid>

        {/* Nội dung và QR */}
         <Grid size={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>Nội dung chuyển khoản & Mã QR</Typography>
        </Grid>
        <Grid size={12}>
          <TextField
            label="Nội dung chuyển khoản (Gợi ý cho Cư dân)"
            fullWidth
            required
            helperText="Sử dụng [MaCanHo], [Ten], [Thang], [Nam], [MaHD] để tạo mẫu nội dung."
            placeholder="Ví dụ: [MaCanHo] - [Ten] - PQL T[Thang]/[Nam]"
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label="Mã QR Thanh toán"
            fullWidth
            value={qrCodeFile ? qrCodeFile.name : 'Chưa chọn ảnh'} // Hiển thị tên file đã chọn
            InputProps={{
              readOnly: true, // Không cho nhập tay
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<UploadFileIcon />}
                    onClick={handleQrUploadClick}
                  >
                    {qrCodeFile ? 'Đổi ảnh' : 'Chọn ảnh'}
                  </Button>
                </InputAdornment>
              ),
            }}
            helperText="Tải lên ảnh mã QR đã tạo từ ứng dụng ngân hàng."
          />
        </Grid>

      </Grid>

      {/* Nút Tạo và Hủy */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button onClick={() => navigate('/accountance/fee/setup/paymentSetup')}>
          Hủy
        </Button>
        <Button variant="contained" onClick={handleCreate}>
          Tạo Thông tin TT
        </Button>
      </Box>
    </Paper>
  );
}