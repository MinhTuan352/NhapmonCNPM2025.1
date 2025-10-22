// src/pages/errors/NotFound.tsx
import { Box, Typography } from "@mui/material";

// Đảm bảo có "export default"
export default function NotFound() {
  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h3">
        404 - Không tìm thấy trang
      </Typography>
    </Box>
  );
}