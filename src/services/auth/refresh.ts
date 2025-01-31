import { User } from '@/types/user/user'
import type { AxiosInstance } from 'axios'

export const refreshToken = (axios: AxiosInstance): Promise<User> =>
  axios.post('/auth/refresh')
