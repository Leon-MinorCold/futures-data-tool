import { futuresKeys } from '@/constants'
import { request } from '@/lib/request'
import { Futures, UpdateFuturesDto } from '@/types/futures/futures'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const updateFutures = (data: UpdateFuturesDto): Promise<Futures> =>
  request.put(`/futures/${data.id}`, data)

export const useUpdateFutures = () => {
  const queryClient = useQueryClient()

  const {
    error,
    isPending: loading,
    mutateAsync: updateFuturesFn,
  } = useMutation({
    mutationFn: updateFutures,
    onSuccess(data) {
      toast.success('更新成功')
      queryClient.invalidateQueries({
        queryKey: futuresKeys.lists(),
      })
      queryClient.setQueryData(futuresKeys.detail(data.id), data)
    },
  })

  return {
    updateFutures: updateFuturesFn,
    loading,
    error,
  }
}
