import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email('无效电子邮箱'),
  username: z.string().min(2, '用户名最少2个字符'),
  role: z.enum(['admin', 'user']),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof userSchema>
