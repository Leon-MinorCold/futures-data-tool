import { request } from '@/lib/request'
import { useAuthStore } from '@/store/auth'
import { User } from '@/types/user/user'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export const getUser = (): Promise<User> => request.get('/users/me')

export const useUser = () => {
  const setUser = useAuthStore((state) => state.setUser)
  const {
    error,
    isPending: loading,
    data: user,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  })

  useEffect(() => {
    setUser(user ?? null)
  }, [user, setUser])

  return { user: user, loading, error }
}
