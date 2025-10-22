// src/schemas/auth.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Tên đăng nhập là bắt buộc'),
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc'),
});

// Tạo kiểu TypeScript từ schema
export type LoginFormInputs = z.infer<typeof loginSchema>;