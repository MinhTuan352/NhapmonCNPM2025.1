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

// Dữ liệu giả (Mock Data) để test (--- CẬP NHẬT --- Yêu cầu 4)
const mockAdmins = [
  { id: 'ID0001', name: 'Nguyễn Văn A', role: 'bod' },
  { id: 'ID0002', name: 'Nguyễn Văn B', role: 'accountance' },
  { id: 'ID0003', name: 'Nguyễn Văn C', role: 'bod' },
  { id: 'ID0004', name: 'Nguyễn Văn D', role: 'accountance' },
  { id: 'ID0005', name: 'Trần Thị E', role: 'bod' },
  { id: 'ID0006', name: 'Lê Văn F', role: 'accountance' },
  { id: 'ID0007', name: 'Phạm Hữu G', role: 'bod' },
  { id: 'ID0008', name: 'Hoàng Minh H', role: 'bod' },
  { id: 'ID0009', name: 'Vũ Thị I', role: 'accountance' },
  { id: 'ID0010', name: 'Đặng Văn K', role: 'bod' },
];

// Định nghĩa màu cho các vai trò (giữ nguyên)
const roleMap = {
  bod: { label: 'Ban quản trị', color: 'primary' },
  accountance: { label: 'Kế toán', color: 'secondary' },
  resident: { label: 'Cư dân', color: 'default' }
};

export default function AdminList() {
  const navigate = useNavigate();

  // (Giữ nguyên các hàm handlers)
  const handleCreateAccount = () => {
    navigate('/bod/admin/profile/create'); //
  };
  
  const handleViewProfile = (adminId: string) => {
    navigate(`/bod/admin/profile/${adminId}`); //
  }

  return (
    <Box>
      {/* HÀNG 1: Tiêu đề + Các nút (giữ nguyên) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          DANH SÁCH QUẢN TRỊ VIÊN
        </Typography>

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
            onClick={handleCreateAccount} //
          >
            Thêm quản trị viên
          </Button>
        </Box>
      </Box>

      {/* HÀNG 2: Danh sách quản trị viên (dạng thẻ) (giữ nguyên) */}
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
                
                {/* Thông tin */}
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
                
                {/* Nút Xem thêm */}
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

      {/* HÀNG 3: Phân trang (giữ nguyên) */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination count={10} color="primary" />
      </Box>
    </Box>
  );
}