import { createZodDto } from '@/lib/dto'
import { dateSchema, paginationSchema } from '@/types/common'
import { z } from 'zod'

export const UserRoleEnum = z.enum(['admin', 'user']).default('user')

export const userSchema = z
  .object({
    id: z.string(),
    email: z.string().email('无效电子邮箱'),
    username: z.string().min(2, '用户名最少2个字符'),
    role: UserRoleEnum,
  })
  .merge(dateSchema)

export const createUserSchema = userSchema.pick({
  email: true,
  username: true,
  role: true,
})

export const updateUserSchema = z
  .object({
    id: z.string(),
  })
  .merge(userSchema.partial().omit({ id: true }))

export const UserListSchema = z.object({}).merge(paginationSchema)

export class User extends createZodDto(userSchema) {}
export class CreateUserDto extends createZodDto(createUserSchema) {}
export class UpdateUserDto extends createZodDto(updateUserSchema) {}
export class UserListDto extends createZodDto(UserListSchema) {}
