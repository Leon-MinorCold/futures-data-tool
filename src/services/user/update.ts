import { userKeys } from '@/constants'
import { request } from '@/lib/request'
import { UpdateUserDto, User } from '@/types/user/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const updateUser = (data: UpdateUserDto): Promise<User> =>
  request.put(`/users/${data.id}`, data)

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  const {
    error,
    isPending: loading,
    mutateAsync: updateUserFn,
  } = useMutation({
    mutationFn: updateUser,
    onSuccess(data) {
      toast.success('更新成功')
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      })
      queryClient.setQueryData(userKeys.detail(data.id), data)
    },
  })

  return {
    error,
    loading,
    updateUser: updateUserFn,
  }
}
