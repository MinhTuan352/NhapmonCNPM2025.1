// src/App.tsx
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext'; // Import

function App() {
  return (
    <AuthProvider> {/* Bọc ở đây */}
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;