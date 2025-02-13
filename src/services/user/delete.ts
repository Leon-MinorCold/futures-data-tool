import { userKeys } from '@/constants'
import { request } from '@/lib/request'
import { User } from '@/types/user/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const deleteUser = (id: string): Promise<User> =>
  request.delete(`/users/${id}`)

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  const {
    error,
    isPending: loading,
    mutateAsync: deleteUserFn,
  } = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess(_, id: string) {
      toast.success('删除成功')
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(id),
      })
    },
  })

  return {
    error,
    loading,
    deleteUser: deleteUserFn,
  }
}
