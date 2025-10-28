// src/pages/BOD/ResidentManagement/ResidentList.tsx
import {
  Box,
  Typography,
  Button,
  Card,
  Avatar,
  Chip,
  Pagination,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRef, type ChangeEvent } from 'react'; 
import * as XLSX from 'xlsx'; 

// Icons
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// Dữ liệu giả (Mock Data) cho Cư dân
const mockResidents = [
  { id: 'R0001', name: 'Trần Văn Hộ', apartment: 'A-101', role: 'owner' },
  { id: 'R0002', name: 'Nguyễn Thị Thành Viên', apartment: 'A-101', role: 'member' },
  { id: 'R0003', name: 'Lê Gia Đình', apartment: 'B-205', role: 'owner' },
  { id: 'R0004', name: 'Phạm Văn B', apartment: 'C-1503', role: 'owner' },
  { id: 'R0005', name: 'Hoàng Thị C', apartment: 'D-404', role: 'member' },
];

// Định nghĩa màu cho vai trò (Yêu cầu 2)
const roleMap = {
  owner: { label: 'Chủ hộ', color: 'primary' },
  member: { label: 'Thành viên', color: 'secondary' },
};

export default function ResidentList() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers cho Navigation (Yêu cầu 3) ---
  const handleCreateResident = () => {
    navigate('/bod/resident/profile/create'); 
  };
  
  const handleViewProfile = (residentId: string) => {
    navigate(`/bod/resident/profile/${residentId}`); 
  }

  // --- Logic Import/Export (Giữ cấu trúc) ---
  const handleExport = () => {
    const dataToExport = mockResidents.map(res => ({
      'ID': res.id,
      'Họ và Tên': res.name,
      'Căn hộ': res.apartment,
      'Quyền hạn': roleMap[res.role as keyof typeof roleMap]?.label || 'Không xác định'
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachCuDan');
    XLSX.writeFile(wb, 'DanhSachCuDan.xlsx');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        console.log('Dữ liệu Cư dân Import từ Excel:', json);
        alert('Đã đọc file Excel thành công! Xem dữ liệu ở Console (F12).');
      } catch (error) {
        console.error("Lỗi khi đọc file Excel:", error);
        alert('Đã xảy ra lỗi khi đọc file.');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  return (
    <Box>
      {/* Input ẩn để Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".xlsx, .xls"
      />

      {/* HÀNG 1: Tiêu đề + Các nút */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          DANH SÁCH CƯ DÂN
        </Typography>

        <Box>
          <Button
            variant="outlined"
            startIcon={<FileUploadIcon />}
            sx={{ mr: 1, backgroundColor: 'white', /* ... */ }}
            onClick={handleImportClick}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            sx={{ mr: 1, backgroundColor: 'white', /* ... */ }}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateResident} // <-- CẬP NHẬT
          >
            Thêm cư dân
          </Button>
        </Box>
      </Box>

      {/* HÀNG 2: Danh sách quản trị viên (dạng thẻ) */}
      <Grid container spacing={2}>
        {mockResidents.map((res) => {
          const roleInfo = roleMap[res.role as keyof typeof roleMap];
          
          return (
            <Grid 
              size={{ xs: 12 }}
              key={res.id}> 
              <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                
                <Avatar sx={{ width: 56, height: 56, mr: 2 }} />
                
                {/* --- CẬP NHẬT THÔNG TIN THẺ (Yêu cầu 2) --- */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{res.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    ID: {res.id} | Căn hộ: {res.apartment}
                  </Typography>
                  <Chip 
                    label={roleInfo.label} 
                    color={roleInfo.color as 'primary' | 'secondary'} 
                    size="small" 
                  />
                </Box>
                
                <Button 
                  variant="contained" 
                  onClick={() => handleViewProfile(res.id)}
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