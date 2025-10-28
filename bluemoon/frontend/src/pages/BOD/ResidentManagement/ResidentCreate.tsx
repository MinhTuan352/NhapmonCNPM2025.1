// src/pages/BOD/ResidentManagement/ResidentCreate.tsx
import {
  Box,
  Typography,
  Grid,
  Card,
  Avatar,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';

export default function ResidentCreate() {
  
  const handleCreateResident = () => {
    alert('Logic tạo Cư dân mới sẽ được thêm vào đây!');
    // (Đây là nơi gọi API /api/residents từ residentController.js)
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Tạo hồ sơ Cư dân
      </Typography>

      <Grid container spacing={3}>
        {/* CỘT BÊN TRÁI: Avatar và ID */}
        <Grid size={{
          xs: 12,
          md: 4
        }}>
          <Card sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center' 
          }}>
            <Avatar sx={{ width: 120, height: 120, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              ID Cư dân mới
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID sẽ được tạo tự động sau khi hoàn tất.
            </Typography>
          </Card>
        </Grid>

        {/* CỘT BÊN PHẢI: Form điền thông tin */}
        <Grid size={{
          xs: 12,
          md: 8
        }}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {/* Họ và tên */}
              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <TextField label="Họ và tên" fullWidth />
              </Grid>
              
              {/* Số căn hộ (residentModel) */}
              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <TextField label="Số căn hộ" fullWidth />
              </Grid>

              {/* Ngày sinh */}
              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <TextField
                  label="Ngày sinh"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Giới tính */}
              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <FormControl fullWidth>
                  <InputLabel>Giới tính</InputLabel>
                  <Select label="Giới tính">
                    <MenuItem value="Nam">Nam</MenuItem>
                    <MenuItem value="Nữ">Nữ</MenuItem>
                    <MenuItem value="Khác">Khác</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* CCCD */}
              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <TextField label="CCCD" fullWidth />
              </Grid>
              
              {/* Số điện thoại (residentModel) */}
              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <TextField label="Số điện thoại" fullWidth />
              </Grid>

              {/* Email */}
              <Grid size={{
                xs: 12
              }}>
                <TextField label="Email" type="email" fullWidth />
              </Grid>
              
              <Grid size={{
                xs: 12
              }}>
                 <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                   Thông tin Cư trú
                 </Typography>
              </Grid>

              {/* Quyền hạn (Yêu cầu 2) */}
              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <FormControl fullWidth>
                  <InputLabel>Quyền hạn</InputLabel>
                  <Select label="Quyền hạn">
                    <MenuItem value="owner">Chủ hộ</MenuItem>
                    <MenuItem value="member">Thành viên</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Tình trạng (residentModel) */}
              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <FormControl fullWidth>
                  <InputLabel>Tình trạng</InputLabel>
                  <Select label="Tình trạng" defaultValue="Đang sinh sống">
                    <MenuItem value="Đang sinh sống">Đang sinh sống</MenuItem>
                    <MenuItem value="Đã chuyển đi">Đã chuyển đi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* (Có thể thêm Username/Password cho tài khoản Cư dân nếu cần) */}
            </Grid>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        mt: 3 
      }}>
        <Button 
          variant="contained" 
          size="large"
          onClick={handleCreateResident}
        >
          Thêm cư dân
        </Button>
      </Box>
    </Paper>
  );
}