// src/pages/Accountant/FeeManagement/AccountantFeeInvoiceEdit.tsx
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Card,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'; // <-- Thêm useEffect
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const mockResidents = [
  { id: 'R0001', name: 'Trần Văn Hộ', apartment: 'A-101' },
  { id: 'R0002', name: 'Lê Gia Đình', apartment: 'B-205' },
];

// Định nghĩa kiểu cho một dòng trong bảng chi tiết
interface InvoiceItem {
  id: number; // ID tạm thời để xóa
  name: string;
  dvt: string;
  sl: number;
  don_gia: number;
  thanh_tien: number;
}

// --- Mock Data (Thay bằng API call) ---
const mockInvoiceDataEdit: { [key: string]: any } = {
  'HD0001': {
    id: 'HD0001', kyhieu: 'BM/23E', so: '0001234', ngay: '2025-10-28',
    resident: { id: 'R0001', name: 'Trần Văn Hộ', apartment: 'A-101' },
    paymentMethod: 'Chuyển khoản', status: 'Đã thanh toán',
    items: [
      { id: 1, name: 'Phí Quản lý T10/2025', dvt: 'Tháng', sl: 1, don_gia: 1200000, thanh_tien: 1200000 },
    ],
  },
  'HD0002': {
     id: 'HD0002', kyhieu: 'BM/23E', so: '0001235', ngay: '2025-10-28',
     resident: { id: 'R0001', name: 'Trần Văn Hộ', apartment: 'A-101' },
     paymentMethod: 'Chuyển khoản', status: 'Chưa thanh toán',
     items: [
       { id: 2, name: 'Phí Gửi xe T10/2025 (Xe 29A-12345)', dvt: 'Tháng', sl: 1, don_gia: 1000000, thanh_tien: 1000000 },
     ],
  }
};

interface InvoiceItem {
  id: number;
  name: string;
  dvt: string;
  sl: number;
  don_gia: number;
  thanh_tien: number;
}


export default function AccountantFeeInvoiceEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // --- State cho Form ---
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [invoiceDate, setInvoiceDate] = useState('');
  const [invoiceStatus, setInvoiceStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [kyHieu, setKyHieu] = useState('');
  const [soHD, setSoHD] = useState('');


  // --- Fetch Data Khi Component Mount ---
  useEffect(() => {
    if (id && mockInvoiceDataEdit[id]) {
        const data = mockInvoiceDataEdit[id];
        // Populate state từ data fetch được
        setSelectedResident(data.resident);
        setItems(data.items);
        setInvoiceDate(data.ngay);
        setInvoiceStatus(data.status);
        setPaymentMethod(data.paymentMethod);
        setKyHieu(data.kyhieu);
        setSoHD(data.so);
    } else {
         navigate('/accountance/fee/list'); // Không tìm thấy
    }
  }, [id, navigate]);


  // --- Logic thêm/xóa/sửa dòng ---
  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), name: '', dvt: '', sl: 1, don_gia: 0, thanh_tien: 0 }]);
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: number, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        // Tự động tính thành tiền nếu sửa Số lượng hoặc Đơn giá
        if (field === 'sl' || field === 'don_gia') {
          const sl = field === 'sl' ? Number(value) : newItem.sl;
          const don_gia = field === 'don_gia' ? Number(value) : newItem.don_gia;
          newItem.thanh_tien = sl * don_gia;
        }
        return newItem;
      }
      return item;
    }));
  };

  // --- Tính tổng tiền ---
  const totalAmount = items.reduce((sum, item) => sum + item.thanh_tien, 0);
  
  // (Hàm chuyển số thành chữ - Bạn có thể tìm thư viện hoặc tự viết)
  const numberToWords = (num: number): string => {
     if (num === 0) return 'Không đồng';
     // ... (logic chuyển đổi phức tạp) ...
     return `${num.toLocaleString('vi-VN')} đồng`; // Placeholder
  }
  const totalInWords = numberToWords(totalAmount);

  // --- Logic Cập nhật ---
  const handleUpdateInvoice = () => {
    // 1. Thu thập dữ liệu từ state
    // 2. Gọi API để cập nhật hóa đơn với 'id'
    alert(`Đã cập nhật Hóa đơn ${id} (Giả lập)`);
    navigate('/accountance/fee/list');
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Cập nhật Hóa đơn (ID: {id})
      </Typography>
      
      <Grid container spacing={3}>
        {/* === Phần Thông tin Chung === */}
        <Grid size={12}>
            <Card sx={{p: 2}}>
                <Typography variant="h6" sx={{ mb: 2 }}>Thông tin Chung</Typography>
                <Grid container spacing={2}>
                     <Grid size={{ xs: 12, sm: 4 }}>
                        {/* Chọn Cư dân (Disabled vì đang Edit) */}
                        <Autocomplete
                          options={mockResidents}
                          getOptionLabel={(option) => `${option.apartment} - ${option.name}`}
                          value={selectedResident} // <-- Gán value
                          readOnly // <-- Không cho sửa
                          renderInput={(params) => <TextField {...params} label="Căn hộ/Chủ hộ" />}
                        />
                    </Grid>
                     <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField 
                            label="Ký hiệu HĐ" 
                            fullWidth 
                            value={kyHieu}
                            onChange={(e) => setKyHieu(e.target.value)}
                        />
                     </Grid>
                     <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField 
                            label="Số HĐ" 
                            fullWidth 
                            value={soHD}
                            onChange={(e) => setSoHD(e.target.value)}
                        />
                     </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                         <TextField 
                            label="Ngày HĐ" 
                            type="date" 
                            fullWidth 
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                         />
                      </Grid>
                     <Grid size={{ xs: 12, sm: 4 }}>
                         <FormControl fullWidth>
                            <InputLabel>Hình thức TT</InputLabel>
                            <Select 
                                label="Hình thức TT" 
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <MenuItem value="Chuyển khoản">Chuyển khoản</MenuItem>
                                <MenuItem value="Tiền mặt">Tiền mặt</MenuItem>
                                <MenuItem value="Khác">Khác</MenuItem>
                            </Select>
                         </FormControl>
                      </Grid>
                     <Grid size={{ xs: 12, sm: 4 }}>
                         <FormControl fullWidth>
                            <InputLabel>Trạng thái HĐ</InputLabel>
                            <Select 
                                label="Trạng thái HĐ" 
                                value={invoiceStatus}
                                onChange={(e) => setInvoiceStatus(e.target.value)}
                            >
                                <MenuItem value="Chưa thanh toán">Chưa thanh toán</MenuItem>
                                <MenuItem value="Đã thanh toán">Đã thanh toán</MenuItem>
                                <MenuItem value="Đã hủy">Đã hủy</MenuItem>
                            </Select>
                         </FormControl>
                      </Grid>
                </Grid>
            </Card>
        </Grid>

        {/* === Phần Chi tiết Hóa đơn (Giống trang Create) === */}
        <Grid size={12}>
           <Card sx={{p: 2}}>
                <Typography variant="h6" sx={{ mb: 2 }}>Chi tiết Hóa đơn</Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            {/* ... (Header Table) ... */}
                        </TableHead>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    {/* ... (Các TableCell với TextField) ... */}
                                    <TableCell>
                                        <TextField 
                                            fullWidth size="small" variant="standard" 
                                            value={item.name}
                                            onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                                        />
                                    </TableCell>
                                     {/* ... (Các TableCell khác) ... */}
                                    <TableCell align="center">
                                        <IconButton size="small" color="error" onClick={() => handleDeleteItem(item.id)} disabled={items.length <= 1}>
                                            <DeleteIcon fontSize="small"/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button startIcon={<AddIcon />} onClick={handleAddItem} sx={{ mt: 1 }}>
                    Thêm dòng
                </Button>
                
                <Divider sx={{ my: 2 }} />
                {/* ... (Tổng tiền và Tiền bằng chữ) ... */}
                 <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ mr: 2, fontWeight: 'bold' }}>Tổng cộng tiền thanh toán:</Typography>
                    <Typography variant="h6">{totalAmount.toLocaleString('vi-VN')} đ</Typography>
                </Box>
                 <TextField 
                    label="Số tiền viết bằng chữ" 
                    fullWidth 
                    value={totalInWords}
                    InputProps={{ readOnly: true }}
                />
           </Card>
        </Grid>
      </Grid>
      
      {/* Nút Cập nhật */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="contained" size="large" onClick={handleUpdateInvoice}>
          Cập nhật Hóa đơn
        </Button>
      </Box>
    </Paper>
  );
}