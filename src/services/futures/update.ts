import { request } from '@/lib/request'
import { Futures, UpdateFuturesDto } from '@/types/futures/futures'
import { useMutation } from '@tanstack/react-query'

export const updateFutures = (data: UpdateFuturesDto): Promise<Futures> =>
  request.put(`/futures/${data.id}`, data)

export const useUpdateFutures = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: updateFuturesFn,
  } = useMutation({
    mutationFn: updateFutures,
    onSuccess(data) {
      console.log('update futures', { data })
    },
  })

  return {
    updateFutures: updateFuturesFn,
    loading,
    error,
  }
}
