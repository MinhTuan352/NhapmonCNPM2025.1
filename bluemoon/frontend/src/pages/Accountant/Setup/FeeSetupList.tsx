// src/pages/Accountant/Setup/FeeSetupList.tsx
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper, // <-- Thêm Paper để bọc
  Divider, // <-- Thêm Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add'; // <-- Icon cho nút Thêm

// --- Mock Data (Thay bằng API call) ---
const mockFeeTypes = [
  { id: 'PQL', name: 'Phí Quản lý', price: 15000, unit: 'm²', description: 'Thu hàng tháng dựa trên diện tích căn hộ.' },
  { id: 'PXE-OTO', name: 'Phí Gửi xe Ô tô', price: 1000000, unit: 'xe/tháng', description: 'Thu cố định hàng tháng cho mỗi xe ô tô đăng ký.' },
  { id: 'PXE-MAY', name: 'Phí Gửi xe Máy', price: 100000, unit: 'xe/tháng', description: 'Thu cố định hàng tháng cho mỗi xe máy đăng ký.' },
  { id: 'PNUOC', name: 'Phí Nước Sinh Hoạt', price: 12000, unit: 'm³', description: 'Thu theo chỉ số đồng hồ nước hàng tháng.' },
  { id: 'PSC', name: 'Phí Sửa chữa Chung', price: 50000, unit: 'hộ/tháng', description: 'Quỹ dự phòng sửa chữa các hạng mục chung.' },
];

export default function FeeSetupList() {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}> {/* Bọc trong Paper */}
      {/* --- Hàng Tiêu đề và Nút Thêm --- */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Thiết lập Các Loại Phí
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/accountance/fee/setup/feeSetup/create')}
        >
          Thêm loại phí
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} /> {/* Thêm đường kẻ ngang */}

      {/* --- Danh sách Thẻ Loại phí --- */}
      <Grid container spacing={3}>
        {mockFeeTypes.map((fee) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={fee.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}> {/* Đảm bảo thẻ cao bằng nhau */}
              <CardContent sx={{ flexGrow: 1 }}> {/* Nội dung chiếm phần lớn thẻ */}
                <Typography variant="h6" gutterBottom>{fee.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  ID: {fee.id}
                </Typography>
                <Typography sx={{ my: 1 }}>
                  <strong>Đơn giá:</strong> {fee.price.toLocaleString('vi-VN')} đ / {fee.unit}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {fee.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}> {/* Nút căn phải */}
                <Button
                  size="small"
                  onClick={() => navigate(`/accountance/fee/setup/feeSetup/edit/${fee.id}`)}
                >
                  Chỉnh sửa
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}