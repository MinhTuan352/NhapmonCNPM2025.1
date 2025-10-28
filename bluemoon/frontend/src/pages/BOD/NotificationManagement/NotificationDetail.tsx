// src/pages/BOD/NotificationManagement/NotificationDetail.tsx
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Chip,
  Grid,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// (Tái định nghĩa mock data ở đây để demo, bạn nên fetch API)
const mockNotifications: { [key: string]: any } = {
  'TB001': { 
    id: 'TB001', 
    title: 'Thông báo lịch cắt điện Tòa A', 
    created_by: 'BQL Nguyễn Văn A',
    created_at: '2025-10-28T10:30:00',
    target: 'Tất cả Cư dân',
    type: 'Khẩn cấp',
    scheduled_at: null,
    content: 'Do sự cố đột xuất tại trạm biến áp, Tòa A sẽ tạm ngưng cung cấp điện từ 14:00 đến 15:00 ngày 28/10/2025 để khắc phục. Mong quý cư dân thông cảm.',
    attachments: [
      { name: 'SoDoTramBienAp.jpg', url: '#' },
    ]
  },
  // ... (thêm các thông báo khác nếu cần)
};

export default function NotificationDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    if (id && mockNotifications[id]) {
      setNotification(mockNotifications[id]);
    }
    // (Trong tương lai: gọi API lấy chi tiết thông báo, bao gồm cả 'content')
  }, [id]);

  if (!notification) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Đang tải thông báo...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      {/* Hàng 1: Nút Back và Tiêu đề */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/bod/notification/list')}
          sx={{ mr: 2 }}
        >
          Quay lại
        </Button>
        <Chip 
          label={notification.type} 
          color={notification.type === 'Khẩn cấp' ? 'error' : (notification.type === 'Thu phí' ? 'warning' : 'primary')} 
        />
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {notification.title}
      </Typography>

      {/* Hàng 2: Thông tin meta */}
      <Grid container spacing={2} sx={{ color: 'text.secondary', my: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2">
            **Người gửi:** {notification.created_by}
          </Typography>
          <Typography variant="body2">
            **Đối tượng:** {notification.target}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2">
            **Ngày tạo:** {new Date(notification.created_at).toLocaleString('vi-VN')}
          </Typography>
          <Typography variant="body2">
            **Lịch gửi:** {notification.scheduled_at 
              ? new Date(notification.scheduled_at).toLocaleString('vi-VN')
              : 'Gửi ngay'}
          </Typography>
        </Grid>
      </Grid>
      
      <Divider sx={{ mb: 3 }} />

      {/* Hàng 3: Nội dung văn bản */}
      <Box sx={{ 
        minHeight: 200, 
        mb: 3, 
        // Giữ nguyên định dạng xuống dòng
        whiteSpace: 'pre-wrap', 
      }}>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          {notification.content}
        </Typography>
      </Box>

      {/* Hàng 4: File đính kèm (nếu có) */}
      {notification.attachments && notification.attachments.length > 0 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>File đính kèm:</Typography>
          {notification.attachments.map((file: any, index: number) => (
            <Button 
              key={index} 
              href={file.url} 
              target="_blank"
              variant="outlined"
              sx={{ mr: 1 }}
            >
              {file.name}
            </Button>
          ))}
        </>
      )}
    </Paper>
  );
}