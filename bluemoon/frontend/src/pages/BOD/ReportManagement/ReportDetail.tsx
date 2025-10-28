// src/pages/BOD/ReportManagement/ReportDetail.tsx
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// (Tái định nghĩa mock data ở đây để demo, bạn nên fetch API)
const mockReportDetail: { [key: string]: any } = {
  'SC001': { 
    id: 'SC001', 
    title: 'Vỡ ống nước khu vực hầm B2', 
    reported_by: 'Trần Văn Hộ (A-101)',
    location: 'Hầm B2, cột 15',
    created_at: '2025-10-28T09:00:00',
    status: 'Mới',
    description: 'Tôi phát hiện nước chảy thành dòng lớn ở hầm B2, khu vực cột 15. Đang ngập ra khu vực đỗ xe. Yêu cầu BQL xử lý khẩn cấp.',
  },
  'SC002': { 
    id: 'SC002', 
    title: 'Thang máy sảnh B liên tục báo lỗi', 
    reported_by: 'Lê Gia Đình (B-205)',
    location: 'Thang máy B, Tòa B',
    created_at: '2025-10-27T14:30:00',
    status: 'Đang xử lý',
    description: 'Thang máy sảnh B (thang chở hàng) đi từ tầng 1 lên tầng 10 thì bị dừng đột ngột và báo lỗi "DOOR_ERR". Phải đợi 5 phút mới mở cửa được. Yêu cầu BQL kiểm tra gấp.',
  },
  // ... (thêm các sự cố khác)
};

type ReportStatus = 'Mới' | 'Đang xử lý' | 'Hoàn thành' | 'Đã hủy';

export default function ReportDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);
  const [currentStatus, setCurrentStatus] = useState<ReportStatus>('Mới');

  useEffect(() => {
    if (id && mockReportDetail[id]) {
      const data = mockReportDetail[id];
      setReport(data);
      setCurrentStatus(data.status); // Set trạng thái ban đầu
    }
    // (Trong tương lai: gọi API lấy chi tiết sự cố)
  }, [id]);

  const handleUpdateStatus = () => {
    // (Đây là nơi gọi API cập nhật trạng thái)
    alert(`Đã cập nhật trạng thái thành: ${currentStatus}`);
  };

  if (!report) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Đang tải chi tiết sự cố...</Typography>
      </Paper>
    );
  }
  
  // Lấy màu chip
  let chipColor: "error" | "warning" | "success" | "default" = "error";
  if (currentStatus === 'Đang xử lý') chipColor = 'warning';
  if (currentStatus === 'Hoàn thành') chipColor = 'success';
  if (currentStatus === 'Đã hủy') chipColor = 'default';

  return (
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      {/* Hàng 1: Nút Back và Tiêu đề */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/bod/report/list')}
          sx={{ mr: 2 }}
        >
          Quay lại
        </Button>
        <Chip 
          label={currentStatus} 
          color={chipColor}
        />
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {report.title}
      </Typography>

      {/* Hàng 2: Thông tin meta */}
      <Grid container spacing={2} sx={{ color: 'text.secondary', my: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2">
            **Người báo cáo:** {report.reported_by}
          </Typography>
          <Typography variant="body2">
            **Vị trí:** {report.location}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2">
            **Ngày báo cáo:** {new Date(report.created_at).toLocaleString('vi-VN')}
          </Typography>
        </Grid>
      </Grid>
      
      <Divider sx={{ mb: 3 }} />

      {/* Hàng 3: Mô tả chi tiết */}
      <Typography variant="h6" sx={{ mb: 1 }}>Mô tả của Cư dân:</Typography>
      <Box sx={{ 
        minHeight: 150, 
        mb: 3, 
        whiteSpace: 'pre-wrap', 
        bgcolor: 'background.default',
        p: 2,
        borderRadius: 2,
      }}>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          {report.description}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Hàng 4: Khu vực xử lý của B.O.D. */}
      <Typography variant="h6" sx={{ mb: 2 }}>Cập nhật xử lý</Typography>
      <Grid container spacing={2} alignItems="flex-start">
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Cập nhật trạng thái</InputLabel>
            <Select
              label="Cập nhật trạng thái"
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value as ReportStatus)}
            >
              <MenuItem value="Mới">Mới</MenuItem>
              <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
              <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
              <MenuItem value="Đã hủy">Đã hủy</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            label="Ghi chú nội bộ (Tùy chọn)"
            fullWidth
            multiline
            rows={3}
            placeholder="Ghi lại quá trình xử lý, vd: Đã gọi thợ..."
          />
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={handleUpdateStatus}
          >
            Lưu cập nhật
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}