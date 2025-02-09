import { request } from '@/lib/request'
import { CreateFuturesDto, Futures } from '@/types/futures/futures'
import { useMutation } from '@tanstack/react-query'

export const createFutures = (data: CreateFuturesDto): Promise<Futures> =>
  request.post('/futures', data)

export const useCreateFutures = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: createFuturesFn,
  } = useMutation({
    mutationFn: createFutures,
    onSuccess(data) {
      console.log({ data })
    },
  })

  return {
    createFutures: createFuturesFn,
    loading,
    error,
  }
}
