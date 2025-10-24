// src/pages/BOD/AdminManagement/AdminList.tsx
import {
  Box,
  Typography,
  Button,
  Card,
  //CardContent,
  Avatar,
  Chip,
  Pagination,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// Dữ liệu giả (Mock Data) để test
const mockAdmins = [
  { id: 'ID0001', name: 'Nguyễn Văn A', role: 'bod' },
  { id: 'ID0002', name: 'Nguyễn Văn B', role: 'accountance' },
  { id: 'ID0003', name: 'Nguyễn Văn C', role: 'bod' },
  { id: 'ID0004', name: 'Nguyễn Văn D', role: 'accountance' },
];

// Định nghĩa màu cho các vai trò [cite: 18]
const roleMap = {
  bod: { label: 'Ban quản trị', color: 'primary' },
  accountance: { label: 'Kế toán', color: 'secondary' },
  resident: { label: 'Cư dân', color: 'default' }
};

export default function AdminList() {
  const navigate = useNavigate();

  // Hàm xử lý khi ấn nút "Tạo tài khoản" [cite: 15]
  const handleCreateAccount = () => {
    navigate('/bod/admin/profile/create'); // Điều hướng đến trang tạo [cite: 2]
  };
  
  // Hàm xử lý khi ấn "Xem thêm" [cite: 19]
  const handleViewProfile = (adminId: string) => {
    navigate(`/bod/admin/profile/${adminId}`); // Điều hướng đến trang hồ sơ [cite: 2]
  }

  return (
    <Box>
      {/* HÀNG 1: Tiêu đề + Các nút [cite: 16] */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        {/* Tiêu đề trang [cite: 16] */}
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          DANH SÁCH QUẢN TRỊ VIÊN
        </Typography>

        {/* Nhóm nút [cite: 16] */}
        <Box>
          <Button
            variant="outlined"
            startIcon={<FileUploadIcon />}
            sx={{ 
              mr: 1, 
              backgroundColor: 'white', 
              color: '#333', 
              borderColor: '#ccc',
              '&:hover': { backgroundColor: '#f9f9f9', borderColor: '#bbb' }
            }}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            sx={{ 
              mr: 1, 
              backgroundColor: 'white', 
              color: '#333', 
              borderColor: '#ccc',
              '&:hover': { backgroundColor: '#f9f9f9', borderColor: '#bbb' }
            }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateAccount} // [cite: 15]
          >
            Tạo tài khoản quản trị viên
          </Button>
        </Box>
      </Box>

      {/* HÀNG 2: Danh sách quản trị viên (dạng thẻ) [cite: 17] */}
      <Grid container spacing={2}>
        {mockAdmins.map((admin) => {
          const roleInfo = roleMap[admin.role as keyof typeof roleMap] || roleMap.resident;
          
          return (
            <Grid 
            size={{
              xs: 12
            }}
            key={admin.id}> {/* Mỗi thẻ chiếm 1 hàng */}
              <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                
                {/* Avatar */}
                <Avatar sx={{ width: 56, height: 56, mr: 2 }} />
                
                {/* Thông tin [cite: 18] */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{admin.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {admin.id}
                  </Typography>
                  <Chip 
                    label={roleInfo.label} 
                    color={roleInfo.color as 'primary' | 'secondary' | 'default'} 
                    size="small" 
                  />
                </Box>
                
                {/* Nút Xem thêm [cite: 19] */}
                <Button 
                  variant="contained" 
                  onClick={() => handleViewProfile(admin.id)}
                >
                  Xem thêm
                </Button>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* HÀNG 3: Phân trang */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination count={10} color="primary" />
      </Box>
    </Box>
  );
}