// src/pages/Resident/Profile/ResidentProfileEdit.tsx
import { Box, Typography, Paper, Grid, TextField, Button, Avatar } from '@mui/material';
// import { useAuth } from '../../../contexts/AuthContext';
// import { useState, useEffect } from 'react';

export default function ResidentProfileEdit() {
 // const { user } = useAuth();
 // const [profileData, setProfileData] = useState({ /* initial data */ });

 // useEffect(() => {
 //   // Fetch detailed resident profile based on user.id from residentModel
 // }, [user]);

 // const handleChange = (e) => { /* Update state */ };

  const handleSaveProfile = () => {
    // Logic to call API to update resident profile (Maybe a different endpoint than BOD uses)
    alert('Lưu thông tin cá nhân...');
  };

 return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            Thông tin Cá nhân
        </Typography>
        <Grid container spacing={3}>
            {/* Avatar Column */}
            <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'center' }}>
                <Avatar sx={{ width: 120, height: 120, mb: 2, margin: 'auto' }} />
                <Button component="label">
                    Đổi ảnh đại diện
                    <input type="file" hidden accept="image/*" />
                </Button>
                <Typography variant="h6" sx={{ mt: 2 }}>[Tên Cư dân]</Typography>
                <Typography color="text.secondary">Căn hộ: [Số căn hộ]</Typography>
            </Grid>
            {/* Info Column */}
            <Grid size={{ xs: 12, md: 8 }}>
                 <Grid container spacing={2}>
                     <Grid size={{ xs: 12 }}>
                        <TextField label="Họ và tên" fullWidth required defaultValue="[Tên Cư dân]" />
                     </Grid>
                     <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Ngày sinh" type="date" fullWidth InputLabelProps={{ shrink: true }} defaultValue="[Ngày sinh]" />
                     </Grid>
                     <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Giới tính" fullWidth defaultValue="[Giới tính]" />
                     </Grid>
                     <Grid size={{ xs: 12, sm: 6 }}>
                         <TextField label="Số điện thoại" fullWidth required defaultValue="[Số điện thoại]" />
                     </Grid>
                     <Grid size={{ xs: 12, sm: 6 }}>
                         <TextField label="Email" type="email" fullWidth defaultValue="[Email]" />
                     </Grid>
                     <Grid size={12}>
                          <TextField label="Quê quán" fullWidth defaultValue="[Quê quán]" />
                     </Grid>
                      <Grid size={12}>
                          <TextField label="Nghề nghiệp" fullWidth defaultValue="[Nghề nghiệp]" />
                     </Grid>
                      <Grid size={12}>
                          <TextField label="CCCD" fullWidth defaultValue="[CCCD]" InputProps={{ readOnly: true }} helperText="Liên hệ BQL để thay đổi thông tin này."/>
                     </Grid>
                 </Grid>
            </Grid>
        </Grid>
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="contained" size="large" onClick={handleSaveProfile}>
                Lưu Thay Đổi
            </Button>
        </Box>
    </Paper>
 );
}