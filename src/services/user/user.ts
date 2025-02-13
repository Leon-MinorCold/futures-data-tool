import { userKeys } from '@/constants'
import { request } from '@/lib/request'
import { useAuthStore } from '@/store/auth'
import { PaginatedResponse } from '@/types/common'
import { User, UserListDto } from '@/types/user/user'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export const getMe = (): Promise<User> => request.get('/users/me')

export const useMe = () => {
  const setUser = useAuthStore((state) => state.setUser)
  const {
    error,
    isPending: loading,
    data: user,
  } = useQuery({
    queryKey: userKeys.details(),
    queryFn: getMe,
  })

  useEffect(() => {
    setUser(user ?? null)
  }, [user, setUser])

  return { user: user, loading, error }
}

export const getUserList = (
  params: UserListDto
): Promise<PaginatedResponse<User>> =>
  request.get('/users', {
    params,
  })

export const useUserList = (filters: UserListDto) => {
  const {
    data,
    isPending: loading,
    error,
  } = useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => getUserList(filters),
  })
  return {
    data,
    loading,
    error,
  }
}

export const getUserData = (id: string): Promise<User> =>
  request.get(`/users/${id}`)

export const useUserData = (id: string) => {
  const {
    data: user,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserData(id),
    enabled: false,
  })

  return {
    user,
    loading,
    error,
    refetch,
  }
}
