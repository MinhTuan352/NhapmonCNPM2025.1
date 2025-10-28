// src/pages/Resident/Report/ResidentReportSend.tsx
import { Box, Typography, Paper, Grid, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';

export default function ResidentReportSend() {
  const navigate = useNavigate();
  // const [title, setTitle] = useState('');
  // const [description, setDescription] = useState('');
  // const [location, setLocation] = useState('');

  const handleSubmitReport = () => {
      // Call API POST /api/incidents
      // with { title, description, location }
      alert('Gửi báo cáo sự cố...');
      navigate('/resident/report/list'); // Navigate to list after sending
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, margin: 'auto', borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            Gửi Báo cáo Sự cố / Yêu cầu
        </Typography>
        <Grid container spacing={3}>
            <Grid size={12}>
                <TextField
                    label="Tiêu đề sự cố / yêu cầu"
                    fullWidth
                    required
                    // value={title}
                    // onChange={(e) => setTitle(e.target.value)}
                    helperText="Mô tả ngắn gọn vấn đề (ví dụ: Mất nước căn hộ A-101, Đèn hành lang T5 bị hỏng)"
                />
            </Grid>
            <Grid size={12}>
                 <TextField
                    label="Vị trí xảy ra (nếu có)"
                    fullWidth
                    // value={location}
                    // onChange={(e) => setLocation(e.target.value)}
                    helperText="Ví dụ: Căn hộ A-101, Hành lang tầng 5 Tòa B, Hầm B2 cột 10"
                />
            </Grid>
            <Grid size={12}>
                <TextField
                    label="Mô tả chi tiết"
                    fullWidth
                    required
                    multiline
                    rows={6}
                    // value={description}
                    // onChange={(e) => setDescription(e.target.value)}
                    helperText="Vui lòng mô tả rõ ràng vấn đề bạn gặp phải."
                />
            </Grid>
            {/* Add file attachment if needed */}
             <Grid size={12}>
                <Button variant="outlined" component="label">
                    Đính kèm ảnh (nếu có)
                    <input type="file" hidden accept="image/*" multiple/>
                </Button>
            </Grid>
        </Grid>
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="contained" size="large" onClick={handleSubmitReport}>
                Gửi Báo Cáo
            </Button>
        </Box>
    </Paper>
  );
}