// src/pages/BOD/AdminManagement/AdminCreate.tsx
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

export default function AdminCreate() {
  
  // (Bạn sẽ thêm react-hook-form và API call vào đây sau)
  const handleCreateAdmin = () => {
    alert('Logic tạo tài khoản mới sẽ được thêm vào đây!');
    // (Đây là nơi gọi API /api/users từ authController.js)
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      {/* Tiêu đề trang */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Tạo tài khoản quản trị viên
      </Typography>

      <Grid container spacing={3}>
        {/* CỘT BÊN TRÁI: Avatar và ID (Yêu cầu 1.2) */}
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
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mb: 2,
              }}
            />
            <Typography variant="h6" gutterBottom>
              ID MỚI
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID tài khoản sẽ được tạo tự động sau khi hoàn tất.
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
                xs: 12
              }}>
                <TextField label="Họ và tên" fullWidth />
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
              
              {/* Số điện thoại */}
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
              
              {/* Divider (Tách thông tin cá nhân và tài khoản) */}
              <Grid size={{
                xs: 12
              }}>
                 <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                   Thông tin tài khoản
                 </Typography>
              </Grid>

              {/* Vai trò */}
              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <FormControl fullWidth>
                  <InputLabel>Vai trò</InputLabel>
                  {/* (Bạn sẽ cần truyền roleId về backend, ví dụ: 1 cho BOD, 2 cho Kế toán) */}
                  <Select label="Vai trò">
                    <MenuItem value={1}>BQT (Ban quản trị)</MenuItem>
                    <MenuItem value={2}>Kế toán</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Username */}
              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <TextField label="Username" fullWidth />
              </Grid>

              {/* Mật khẩu */}
              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <TextField
                  label="Mật khẩu"
                  type="password"
                  fullWidth
                  helperText="Mật khẩu mặc định sẽ là '12345678' nếu bỏ trống"
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      
      {/* Nút Thêm (Yêu cầu 1.2) */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        mt: 3 
      }}>
        <Button 
          variant="contained" 
          size="large"
          onClick={handleCreateAdmin}
        >
          Thêm quản trị viên
        </Button>
      </Box>
    </Paper>
  );
}