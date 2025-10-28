// src/pages/BOD/NotificationManagement/NotificationCreate.tsx
import {
  Box,
  Typography,
  Grid,
  Card,
  TextField,
  Button,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  MenuItem, // --- THÊM MỚI ---
  Select, // --- THÊM MỚI ---
  InputLabel, // --- THÊM MỚI ---
  Checkbox, // --- THÊM MỚI ---
  Chip, // --- THÊM MỚI ---
  Stack, // --- THÊM MỚI ---
} from '@mui/material';
import { useState, type ChangeEvent, useRef } from 'react'; // --- CẬP NHẬT ---
import UploadFileIcon from '@mui/icons-material/UploadFile'; // --- THÊM MỚI ---

// Giả lập danh sách User (sau này bạn sẽ fetch từ API)
const mockUserList = [
  { id: 101, name: 'Trần Văn Hộ (A-101)' },
  { id: 102, name: 'Lê Gia Đình (B-205)' },
  { id: 103, name: 'Phạm Văn B (C-1503)' },
  { id: 104, name: 'Hoàng Thị C (D-404)' },
];

export default function NotificationCreate() {
  const [targetType, setTargetType] = useState('all_residents');
  
  // --- THÊM MỚI: State cho file đính kèm ---
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- THÊM MỚI: State cho hẹn lịch ---
  const [scheduleEnabled, setScheduleEnabled] = useState(false);

  const handleSendNotification = () => {
    // (Đây là nơi bạn thu thập dữ liệu từ form và gọi API)
    // Dựa trên controller
    alert('Logic gửi thông báo... (chưa implement)');
  };

  // --- THÊM MỚI: Handlers cho file đính kèm ---
  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Thêm file mới vào danh sách file đã chọn
      setSelectedFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files!)]);
    }
    // Reset input để có thể chọn lại file
    e.target.value = '';
  };

  const handleFileDelete = (fileToDelete: File) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file !== fileToDelete));
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Soạn Thông Báo Mới
      </Typography>

      {/* Input file ẩn */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        style={{ display: 'none' }}
        multiple // Cho phép chọn nhiều file
        accept="image/*, application/pdf, .doc, .docx, .xls, .xlsx"
      />

      <Grid container spacing={3}>
        {/* CỘT BÊN TRÁI: Soạn thảo */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {/* Tiêu đề */}
              <Grid size={{ xs: 12 }}>
                <TextField 
                  label="Tiêu đề thông báo" 
                  fullWidth 
                  required
                />
              </Grid>

              {/* --- THÊM MỚI: Loại thông báo --- */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Loại thông báo</InputLabel>
                  <Select label="Loại thông báo" defaultValue="Chung">
                    <MenuItem value="Chung">Chung</MenuItem>
                    <MenuItem value="Thu phí">Thu phí</MenuItem>
                    <MenuItem value="Khẩn cấp">Khẩn cấp</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Nội dung */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Nội dung"
                  fullWidth
                  required
                  multiline
                  rows={10}
                  helperText="Nhập nội dung chi tiết của thông báo tại đây."
                />
              </Grid>

              {/* --- THÊM MỚI: Đính kèm file --- */}
              <Grid size={{ xs: 12 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<UploadFileIcon />}
                  onClick={handleFileSelectClick}
                >
                  Đính kèm file/ảnh
                </Button>
                {/* Hiển thị danh sách file đã chọn */}
                <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
                  {selectedFiles.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => handleFileDelete(file)}
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </Stack>
              </Grid>
              
            </Grid>
          </Card>
        </Grid>

        {/* CỘT BÊN PHẢI: Gửi tới ai & Hẹn lịch */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>Đối tượng gửi</FormLabel>
              <RadioGroup
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
              >
                {/* 1. Gửi tất cả (Logic: all_residents) */}
                <FormControlLabel 
                  value="all_residents" 
                  control={<Radio />} 
                  label="Tất cả Cư dân" 
                />
                
                {/* 2. Gửi cá nhân (Logic: specific_users) */}
                <FormControlLabel 
                  value="specific_users" 
                  control={<Radio />} 
                  label="Cư dân cụ thể" 
                />
              </RadioGroup>
            </FormControl>
            
            {/* --- Hiển thị có điều kiện --- */}
            {targetType === 'specific_users' && (
              <Box sx={{ mt: 2 }}>
                <Autocomplete
                  multiple
                  options={mockUserList}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tìm kiếm Cư dân"
                      placeholder="Chọn một hoặc nhiều..."
                    />
                  )}
                />
              </Box>
            )}
          </Card>

          {/* --- THÊM MỚI: Card Hẹn lịch --- */}
          <Card sx={{ p: 3 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>Hẹn lịch gửi</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={scheduleEnabled} 
                    onChange={(e) => setScheduleEnabled(e.target.checked)} 
                  />
                }
                label="Gửi theo lịch"
              />
              
              {scheduleEnabled && (
                <TextField
                  type="datetime-local"
                  fullWidth
                  sx={{ mt: 1 }}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </FormControl>
          </Card>
        </Grid>
      </Grid>
      
      {/* Nút Gửi */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        mt: 3 
      }}>
        <Button 
          variant="contained" 
          size="large"
          onClick={handleSendNotification}
        >
          Gửi thông báo
        </Button>
      </Box>
    </Paper>
  );
}