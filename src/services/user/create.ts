import { userKeys } from '@/constants'
import { request } from '@/lib/request'
import { CreateUserDto, User } from '@/types/user/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const createUser = (data: CreateUserDto): Promise<User> =>
  request.post('/users', data)

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  const {
    error,
    isPending: loading,
    mutateAsync: createUserFn,
  } = useMutation({
    mutationFn: createUser,
    onSuccess(data) {
      toast.success('新增成功')
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      })
      queryClient.setQueryData(userKeys.detail(data.id), data)
    },
  })

  return {
    createUser: createUserFn,
    loading,
    error,
  }
}
