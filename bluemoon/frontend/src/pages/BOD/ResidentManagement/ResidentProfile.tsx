// src/pages/BOD/ResidentManagement/ResidentProfile.tsx
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
  type SelectChangeEvent,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// (Cập nhật Mock Data với các trường mới)
const mockData = {
  'R0001': {
    fullName: 'Trần Văn Hộ',
    apartment: 'A-101',
    role: 'owner', // <-- Chủ hộ
    dob: '1980-01-01',
    gender: 'Nam',
    cccd: '012345678001',
    phone: '0900000001',
    email: 'chuho.a@bluemoon.com',
    status: 'Đang sinh sống',
    hometown: 'Hà Nội', // <-- THÊM MỚI
    occupation: 'Kỹ sư', // <-- THÊM MỚI
    username: 'chuho_a101', // <-- THÊM MỚI
  },
  'R0002': {
    fullName: 'Nguyễn Thị Thành Viên',
    apartment: 'A-101',
    role: 'member', // <-- Thành viên
    dob: '1985-02-02',
    gender: 'Nữ',
    cccd: '012345678002',
    phone: '0900000002',
    email: 'thanhvien.a@bluemoon.com',
    status: 'Đang sinh sống',
    hometown: 'Hải Phòng', // <-- THÊM MỚI
    occupation: 'Giáo viên', // <-- THÊM MỚI
    username: null, // (Không có tài khoản)
  },
};

export default function ResidentProfile() {
  const { id } = useParams<{ id: string }>(); 
  const [userData, setUserData] = useState<any>(null);
  const [currentRole, setCurrentRole] = useState('');

  useEffect(() => {
    if (id && (mockData as any)[id]) {
      const data = (mockData as any)[id];
      setUserData(data);
      setCurrentRole(data.role); // <-- Set vai trò ban đầu
    }
  }, [id]);

  const handleRoleChange = (event: SelectChangeEvent) => {
    setCurrentRole(event.target.value as string);
  };

  const handleUpdateResident = () => {
    alert('Logic cập nhật Cư dân sẽ được thêm vào đây!');
    // (Đây là nơi gọi API /api/residents/:id từ residentController.js)
  };

  if (!userData) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5">Đang tải...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Hồ sơ Cư dân
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
              {id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Căn hộ: {userData.apartment}
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
              {/* (Điền sẵn defaultValue) */}
              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <TextField label="Họ và tên" fullWidth defaultValue={userData.fullName} />
              </Grid>
              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <TextField label="Số căn hộ" fullWidth defaultValue={userData.apartment} />
              </Grid>
              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <TextField
                  label="Ngày sinh"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  defaultValue={userData.dob}
                />
              </Grid>
              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <FormControl fullWidth>
                  <InputLabel>Giới tính</InputLabel>
                  <Select label="Giới tính" defaultValue={userData.gender}>
                    <MenuItem value="Nam">Nam</MenuItem>
                    <MenuItem value="Nữ">Nữ</MenuItem>
                    <MenuItem value="Khác">Khác</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* --- THÊM MỚI: Quê quán --- */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Quê quán" fullWidth defaultValue={userData.hometown} />
              </Grid>
              
              {/* --- THÊM MỚI: Nghề nghiệp --- */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Nghề nghiệp" fullWidth defaultValue={userData.occupation} />
              </Grid>

              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <TextField label="CCCD" fullWidth defaultValue={userData.cccd} />
              </Grid>
              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <TextField label="Số điện thoại" fullWidth defaultValue={userData.phone} />
              </Grid>
              <Grid size={{
                xs: 12
              }}>
                <TextField label="Email" type="email" fullWidth defaultValue={userData.email} />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                 <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                   Thông tin Cư trú & Tài khoản
                 </Typography>
              </Grid>

              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <FormControl fullWidth>
                  <InputLabel>Quyền hạn</InputLabel>
                  <Select 
                  label="Quyền hạn" 
                  value={currentRole} // <-- CẬP NHẬT
                  onChange={handleRoleChange} // <-- CẬP NHẬT
                  >
                    <MenuItem value="owner">Chủ hộ</MenuItem>
                    <MenuItem value="member">Thành viên</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{
                xs: 12,
                sm: 6
              }}>
                <FormControl fullWidth>
                  <InputLabel>Tình trạng</InputLabel>
                  <Select label="Tình trạng" defaultValue={userData.status}>
                    <MenuItem value="Đang sinh sống">Đang sinh sống</MenuItem>
                    <MenuItem value="Đã chuyển đi">Đã chuyển đi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* --- THÊM MỚI: Khối tài khoản (Conditional) --- */}
              {currentRole === 'owner' && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Username (tài khoản Cư dân)"
                      fullWidth
                      defaultValue={userData.username}
                      helperText="Cư dân sẽ dùng tài khoản này để đăng nhập"
                      sx={{ mt: 2 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Mật khẩu (tài khoản Cư dân)"
                      type="password"
                      fullWidth
                      helperText="Bỏ trống nếu không muốn đổi mật khẩu"
                      sx={{ mt: 2 }}
                    />
                  </Grid>
                </>
              )}
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
          onClick={handleUpdateResident}
        >
          Cập nhật
        </Button>
      </Box>
    </Paper>
  );
}