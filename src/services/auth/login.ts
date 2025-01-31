import { useMutation } from '@tanstack/react-query'
import { request } from '@/lib/request'
import { LoginDto } from '@/types/auth/login'
import { User } from '@/types/user/user'
import { useAuthStore } from '@/store/auth'
import { queryClient } from '@/lib/provider'

export const login = (data: LoginDto): Promise<User> =>
  request.post('/auth/login', data)

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser)

  const {
    error,
    isPending: loading,
    mutateAsync: loginFn,
  } = useMutation({
    mutationFn: login,
    onSuccess(data) {
      setUser(data)
      queryClient.setQueryData(['user'], data)
    },
  })

  return {
    login: loginFn,
    loading,
    error,
  }
}
