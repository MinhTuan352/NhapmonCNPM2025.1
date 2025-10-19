import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // (Hoặc plugin-react)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Thêm phần này
    proxy: {
      // Bất kỳ request nào bắt đầu bằng /api sẽ được chuyển đến backend
      '/api': {
        target: 'http://localhost:3000', // Sửa port này cho đúng với backend của bạn
        changeOrigin: true,
        // (Tùy chọn) Xóa /api khỏi request nếu backend không cần
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      }
    }
  }
})