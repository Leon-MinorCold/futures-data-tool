import axios, { AxiosResponse } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { toast } from 'sonner'
import { redirect } from 'react-router'
import { queryClient } from '@/lib/provider'
import { ResponseCode } from '@/types/request'
import { refreshToken } from '@/services/auth/refresh'

interface ApiResponse<T> {
  data: T
  code: ResponseCode
  message?: string
}

const isDev = process.env.NODE_ENV === 'development'

console.log('axios', { isDev })

const baseURL = isDev
  ? 'http://localhost:3000/api'
  : 'https://futures-data-tool-backend.vercel.app/api'

// 创建 axios 实例
export const request = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    return response.data.data
  },
  (error) => {
    // 处理 Axios 错误

    console.log('axios error', error)
    const message = error.response?.data.message

    if (message) {
      toast.error('Oops, the server returned an error.', {
        description: message,
      })
    }

    return Promise.reject({ message })
  }
)

// 封装请求方法
export const http = {
  get<T = any>(url: string, config = {}) {
    return request.get<T, T>(url, config)
  },

  post<T = any>(url: string, data = {}, config = {}) {
    return request.post<T, T>(url, data, config)
  },

  put<T = any>(url: string, data = {}, config = {}) {
    return request.put<T, T>(url, data, config)
  },

  delete<T = any>(url: string, config = {}) {
    return request.delete<T, T>(url, config)
  },

  patch<T = any>(url: string, data = {}, config = {}) {
    return request.patch<T, T>(url, data, config)
  },
}

// Create another instance to handle failed refresh tokens
// Reference: https://github.com/Flyrell/axios-auth-refresh/issues/191
const axiosForRefresh = axios.create({
  baseURL,
  withCredentials: true,
})

// Interceptor to handle expired access token errors
const handleAuthError = () => refreshToken(axiosForRefresh)

// Interceptor to handle expired refresh token errors
const handleRefreshError = async () => {
  // Todo: invalida user cache data
  // await queryClient.invalidateQueries({ queryKey: 'user' })
  redirect('/auth/login')
}

// Intercept responses to check for 401 and 403 errors, refresh token and retry the request
createAuthRefreshInterceptor(axios, handleAuthError, {
  statusCodes: [401, 403],
})
createAuthRefreshInterceptor(axiosForRefresh, handleRefreshError)
