import { request } from '@/lib/request'
import { Futures } from '@/types/futures/futures'
import { useMutation } from '@tanstack/react-query'

export const deleteFutures = (id: string): Promise<Futures> =>
  request.delete(`/futures/${id}`)

export const useDeleteFutures = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: deleteFuturesFn,
  } = useMutation({
    mutationFn: deleteFutures,
    onSuccess(data) {
      console.log('delete futures', { data })
    },
  })

  return {
    deleteFutures: deleteFuturesFn,
    loading,
    error,
  }
}
