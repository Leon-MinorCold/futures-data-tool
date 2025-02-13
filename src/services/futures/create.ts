import { request } from '@/lib/request'
import { CreateFuturesDto, Futures } from '@/types/futures/futures'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { futuresKeys } from '@/constants/query-keys'

export const createFutures = (data: CreateFuturesDto): Promise<Futures> =>
  request.post('/futures', data)

export const useCreateFutures = () => {
  const queryClient = useQueryClient()

  const {
    error,
    isPending: loading,
    mutateAsync: createFuturesFn,
  } = useMutation({
    mutationFn: createFutures,
    onSuccess(data) {
      toast.success('新增成功')
      queryClient.invalidateQueries({
        queryKey: futuresKeys.lists(),
      })
      queryClient.setQueryData(futuresKeys.detail(data.id), data)
    },
  })

  return {
    createFutures: createFuturesFn,
    loading,
    error,
  }
}
