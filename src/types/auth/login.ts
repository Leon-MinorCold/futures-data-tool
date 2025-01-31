import { z } from 'zod'

import { userSchema } from '@/types/user/user'
import { createZodDto } from '@/lib/dto'

export const loginSchema = z
  .object({
    identifier: z.string().min(6, '最少6个字符'),
    password: z.string().min(6, '密码最少6个字符'),
  })
  .superRefine((data, ctx) => {
    if (data.identifier.includes('@')) {
      const emailResult = z.string().email().min(10).safeParse(data.identifier)
      if (!emailResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: emailResult.error.errors[0]?.message || '无效电子邮箱',
          path: ['identifier'],
        })
      }
    } else {
      const usernameResult = userSchema.safeParse(data.identifier)
      if (!usernameResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: usernameResult.error.errors[0]?.message || '无效凭证',
          path: ['identifier'],
        })
      }
    }
  })

export class LoginDto extends createZodDto(loginSchema) {}
