import { futuresKeys } from '@/constants'
import { request } from '@/lib/request'
import { Futures } from '@/types/futures/futures'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const deleteFutures = (id: string): Promise<Futures> =>
  request.delete(`/futures/${id}`)

export const useDeleteFutures = () => {
  const queryClient = useQueryClient()

  const {
    error,
    isPending: loading,
    mutateAsync: deleteFuturesFn,
  } = useMutation({
    mutationFn: (id: string) => deleteFutures(id),
    onSuccess(_, id: string) {
      toast.success('删除成功')
      queryClient.invalidateQueries({
        queryKey: futuresKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: futuresKeys.detail(id),
      })
    },
  })

  return {
    deleteFutures: deleteFuturesFn,
    loading,
    error,
  }
}
