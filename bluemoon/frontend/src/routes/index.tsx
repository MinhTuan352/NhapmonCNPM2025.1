// src/routes/index.tsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoutes from './ProtectedRoutes'; // Import

// Import các trang
import SignIn from '../pages/Auth/SignIn';
import AdminList from '../pages/BOD/AdminManagement/AdminList';
import NotFound from '../pages/errors/NotFound';
import AdminCreate from '../pages/BOD/AdminManagement/AdminCreate';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Route công khai */}
      <Route path="/signin" element={<SignIn />} />

      {/* Bọc các route cần bảo vệ bằng ProtectedRoutes */}
      <Route element={<ProtectedRoutes />}>
        {/* Tất cả các route bên trong này đều phải đăng nhập mới vào được */}
        <Route path="/" element={<MainLayout />}>
          
          {/* BOD Routes (Ví dụ: chỉ cho phép 'bod') */}
          <Route 
            element={
              <ProtectedRoutes allowedRoles={['bod']} />
            }
          >
            <Route path="bod/admin/list" element={<AdminList />} />

            {/* --- THÊM MỚI (Yêu cầu 1.2) --- */}
            <Route path="bod/admin/profile/create" element={<AdminCreate />} />
            
            {/* ... các route bod khác ... */}
          </Route>

          {/* ... các route cho Kế toán và Cư dân ... */}

          <Route index element={<AdminList />} />
        </Route>
      </Route>

      {/* Route 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}