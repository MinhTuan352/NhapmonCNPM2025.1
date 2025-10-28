// src/pages/Accountant/Setup/AccountantSetup.tsx
import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AccountantSetup() {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Thiết lập Phí & Thanh toán
      </Typography>
      <Grid container spacing={3}>
        {/* Thẻ 1: Thiết lập phí */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Thiết lập Phí</Typography>
              <Typography variant="body2" color="text.secondary">
                Quản lý các loại phí dịch vụ của chung cư (phí quản lý, phí gửi xe, phí nước, v.v.)
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                onClick={() => navigate('/accountance/fee/setup/feeSetup')}
              >
                Xem chi tiết
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Thẻ 2: Thiết lập TT Thanh toán */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Thiết lập Thông tin Thanh toán</Typography>
              <Typography variant="body2" color="text.secondary">
                Quản lý tài khoản ngân hàng, mã QR và nội dung chuyển khoản cho từng loại phí.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                onClick={() => navigate('/accountance/fee/setup/paymentSetup')}
              >
                Xem chi tiết
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}