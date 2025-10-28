// src/pages/Accountant/Setup/FeeSetupEdit.tsx
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
  type SelectChangeEvent,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'; // <-- Thêm state, effect
import InfoIcon from '@mui/icons-material/Info';

// --- Mock Data (Thay bằng API call) ---
const mockFeeTypeData: { [key: string]: any } = {
  'PQL': { id: 'PQL', name: 'Phí Quản lý', price: 15000, unit: 'm²', calculation: 'area', description: 'Thu hàng tháng dựa trên diện tích căn hộ.' },
  'PXE-OTO': { id: 'PXE-OTO', name: 'Phí Gửi xe Ô tô', price: 1000000, unit: 'xe/tháng', calculation: 'fixed', description: 'Thu cố định hàng tháng cho mỗi xe ô tô đăng ký.' },
  // ...
};

export default function FeeSetupEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [feeData, setFeeData] = useState<any>(null); // State để lưu dữ liệu

  // --- Fetch Data ---
  useEffect(() => {
    if (id && mockFeeTypeData[id]) {
      setFeeData(mockFeeTypeData[id]);
    } else {
      navigate('/accountance/fee/setup/feeSetup'); // Không tìm thấy thì quay lại
    }
  }, [id, navigate]);

  const handleUpdate = () => {
    // Logic gọi API cập nhật loại phí với 'id' và 'feeData'
    alert(`Đã cập nhật loại phí ${id} (Giả lập)`);
    navigate('/accountance/fee/setup/feeSetup');
  };

  // --- Hàm cập nhật state khi form thay đổi ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFeeData((prev: any) => ({ ...prev, [name]: value }));
  };


  if (!feeData) {
    return <Typography>Đang tải...</Typography>; // Hoặc loading
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 700, margin: 'auto', borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        Chỉnh sửa Loại Phí (Mã: {id})
      </Typography>
      <Grid container spacing={3}>
        {/* ID Phí (Không cho sửa) */}
        <Grid size={12}>
          <TextField
            label="Mã Phí"
            fullWidth
            value={feeData.id}
            InputProps={{ readOnly: true, // Không cho sửa mã
              endAdornment: (
                <Tooltip title="Mã phí là định danh duy nhất, không thể thay đổi.">
                  <InfoIcon color="action" sx={{ cursor: 'help' }} />
                </Tooltip>
              )
            }}
          />
        </Grid>

        {/* Tên loại phí */}
        <Grid size={12}>
          <TextField
            label="Tên Loại Phí"
            name="name" // <-- Thêm name để state biết là field nào
            fullWidth
            required
            value={feeData.name}
            onChange={handleChange}
            helperText="Tên sẽ hiển thị trên hóa đơn cho cư dân."
          />
        </Grid>

        {/* Đơn giá & Đơn vị tính */}
        <Grid size={6}>
          <TextField
            label="Đơn giá (VNĐ)"
            name="price"
            type="number"
            fullWidth
            required
            value={feeData.price}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            label="Đơn vị tính"
            name="unit"
            fullWidth
            required
            value={feeData.unit}
            onChange={handleChange}
            helperText="Ví dụ: m², xe/tháng, hộ/tháng, m³, kWh"
          />
        </Grid>

        {/* Cách tính */}
        <Grid size={12}>
           <FormControl fullWidth>
            <InputLabel>Cách tính</InputLabel>
            <Select
              label="Cách tính"
              name="calculation"
              value={feeData.calculation}
              onChange={handleChange}
            >
              <MenuItem value="fixed">Thu cố định theo đơn vị</MenuItem>
              <MenuItem value="area">Nhân với diện tích căn hộ</MenuItem>
              <MenuItem value="usage">Nhân với chỉ số sử dụng (nước, điện)</MenuItem>
              <MenuItem value="manual">Nhập tay thủ công mỗi kỳ</MenuItem>
            </Select>
            <Typography variant="caption" sx={{ mt: 0.5, ml: 1.5, color: 'text.secondary' }}>
              Xác định cách hệ thống tự động tính tiền cho loại phí này.
            </Typography>
          </FormControl>
        </Grid>

        {/* Mô tả */}
        <Grid size={12}>
          <TextField
            label="Mô tả (Tùy chọn)"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={feeData.description}
            onChange={handleChange}
            helperText="Giải thích rõ hơn về loại phí này nếu cần."
          />
        </Grid>
      </Grid>

      {/* Nút Cập nhật và Hủy */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button onClick={() => navigate('/accountance/fee/setup/feeSetup')}>
          Hủy
        </Button>
        <Button variant="contained" onClick={handleUpdate}>
          Cập nhật
        </Button>
      </Box>
    </Paper>
  );
}