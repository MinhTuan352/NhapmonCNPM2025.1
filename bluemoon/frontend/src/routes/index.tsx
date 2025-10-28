// src/routes/index.tsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoutes from './ProtectedRoutes'; // Import

// Import các trang
import SignIn from '../pages/Auth/SignIn';
import AdminList from '../pages/BOD/AdminManagement/AdminList';
import NotFound from '../pages/errors/NotFound';
import AdminCreate from '../pages/BOD/AdminManagement/AdminCreate.tsx';
import AdminProfile from '../pages/BOD/AdminManagement/AdminProfile';
import ResidentList from '../pages/BOD/ResidentManagement/ResidentList';
import ResidentCreate from '../pages/BOD/ResidentManagement/ResidentCreate';
import ResidentProfile from '../pages/BOD/ResidentManagement/ResidentProfile';
import FeeList from '../pages/BOD/FeeManagement/FeeList';
import NotificationList from '../pages/BOD/NotificationManagement/NotificationList';
import NotificationCreate from '../pages/BOD/NotificationManagement/NotificationCreate';
import NotificationDetail from '../pages/BOD/NotificationManagement/NotificationDetail';

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
            <Route path="bod/admin/profile/create" element={<AdminCreate />} />
            <Route path="bod/admin/profile/:id" element={<AdminProfile />} />

            <Route path="bod/resident/list" element={<ResidentList />} />
            <Route path="bod/resident/profile/create" element={<ResidentCreate />} />
            <Route path="bod/resident/profile/:id" element={<ResidentProfile />} />

            <Route path="bod/fee/list" element={<FeeList />} />

            <Route path="bod/notification/list" element={<NotificationList />} />
            <Route path="bod/notification/create" element={<NotificationCreate />} />
            <Route path="bod/notification/detail/:id" element={<NotificationDetail />} />
            
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