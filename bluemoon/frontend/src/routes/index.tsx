// src/routes/index.tsx (Hoặc nội dung cho App.tsx)
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

// Import các trang (Pages)
// (Giả sử bạn đã tạo 2 trang này)
import SignIn from '../pages/Auth/SignIn'; 
import AdminList from '../pages/BOD/AdminManagement/AdminList';
import NotFound from '../pages/errors/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Route cho trang Đăng nhập (không dùng MainLayout) */}
      <Route path="/signin" element={<SignIn />} />

      {/* Các routes dùng MainLayout */}
      {/* (Sau này bạn sẽ bọc 'ProtectedRoute' ở đây) */}
      <Route path="/" element={<MainLayout />}>
        {/* Dựa trên file "Cấu trúc hệ thống", 
          đây là các route con của MainLayout 
        */}
        
        {/* Route cho BOD */}
        <Route path="bod/admin/list" element={<AdminList />} />
        {/* <Route path="bod/admin/profile/:id" element={<AdminProfile />} /> */}
        {/* ... (thêm các route khác của BOD) ... */}
        
        {/* (Thêm các route cho Kế toán và Cư dân ở đây) */}

        {/* Route mặc định (ví dụ: dashboard)
            Bạn có thể tạo 1 trang <Dashboard />
            hoặc redirect về trang list admin
        */}
        <Route index element={<AdminList />} /> 
      </Route>

      {/* Route 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}