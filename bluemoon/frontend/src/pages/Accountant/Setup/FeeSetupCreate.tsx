// src/pages/Accountant/Setup/FeeSetupCreate.tsx
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
  Tooltip, // <-- Thêm Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info'; // <-- Icon cho Tooltip

export default function FeeSetupCreate() {
  const navigate = useNavigate();

  const handleCreate = () => {
    // Logic gọi API tạo loại phí mới
    alert('Đã tạo loại phí mới (Giả lập)');
    navigate('/accountance/fee/setup/feeSetup');
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 700, margin: 'auto', borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        Thêm Loại Phí Mới
      </Typography>
      <Grid container spacing={3}>
        {/* ID Phí */}
        <Grid size={12}>
          <TextField
            label="Mã Phí (Viết liền, không dấu)"
            fullWidth
            required
            helperText="Ví dụ: PQL, PXEOTO, PNUOC. Mã này không thể thay đổi sau khi tạo."
            InputProps={{ // Thêm icon giải thích
              endAdornment: (
                <Tooltip title="Mã phí là định danh duy nhất, dùng trong công thức hoặc import/export.">
                  <InfoIcon color="action" sx={{ cursor: 'help' }} />
                </Tooltip>
              )
            }}
          />
        </Grid>

        {/* Tên loại phí */}
        <Grid size={12}>
          <TextField label="Tên Loại Phí" fullWidth required helperText="Tên sẽ hiển thị trên hóa đơn cho cư dân."/>
        </Grid>

        {/* Đơn giá & Đơn vị tính */}
        <Grid size={6}>
          <TextField
            label="Đơn giá (VNĐ)"
            type="number"
            fullWidth
            required
            InputProps={{ inputProps: { min: 0 } }} // Không cho nhập số âm
          />
        </Grid>
        <Grid size={6}>
          <TextField
            label="Đơn vị tính"
            fullWidth
            required
            helperText="Ví dụ: m², xe/tháng, hộ/tháng, m³, kWh"
          />
        </Grid>

        {/* Cách tính (Tùy chọn nâng cao) */}
        <Grid size={12}>
           <FormControl fullWidth>
            <InputLabel>Cách tính</InputLabel>
            <Select label="Cách tính" defaultValue="fixed">
              <MenuItem value="fixed">Thu cố định theo đơn vị</MenuItem>
              <MenuItem value="area">Nhân với diện tích căn hộ</MenuItem>
              <MenuItem value="usage">Nhân với chỉ số sử dụng (nước, điện)</MenuItem>
              <MenuItem value="manual">Nhập tay thủ công mỗi kỳ</MenuItem>
            </Select>
            <Typography variant="caption" sx={{ mt: 0.5, ml: 1.5, color: 'text.secondary' }}>
              Xác định cách hệ thống tự động tính tiền cho loại phí này khi lập hóa đơn hàng loạt.
            </Typography>
          </FormControl>
        </Grid>

        {/* Mô tả */}
        <Grid size={12}>
          <TextField
            label="Mô tả (Tùy chọn)"
            fullWidth
            multiline
            rows={3}
            helperText="Giải thích rõ hơn về loại phí này nếu cần."
          />
        </Grid>
      </Grid>

      {/* Nút Tạo và Hủy */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button onClick={() => navigate('/accountance/fee/setup/feeSetup')}>
          Hủy
        </Button>
        <Button variant="contained" onClick={handleCreate}>
          Tạo Loại Phí
        </Button>
      </Box>
    </Paper>
  );
}