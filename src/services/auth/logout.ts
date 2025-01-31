import { queryClient } from '@/lib/provider'
import { request } from '@/lib/request'
import { useAuthStore } from '@/store/auth'
import { useMutation } from '@tanstack/react-query'

export const logout = () => request.post('/auth/logout')

export const useLogout = () => {
  const setUser = useAuthStore((state) => state.setUser)

  const {
    error,
    isPending: loading,
    mutateAsync: logoutFn,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setUser(null)
      queryClient.setQueryData(['user'], null)
    },
    onError: () => {
      setUser(null)
      queryClient.setQueryData(['user'], null)
    },
  })

  return { logout: logoutFn, loading, error }
}
