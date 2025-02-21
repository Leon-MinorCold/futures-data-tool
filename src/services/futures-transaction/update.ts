import { futuresTransactionKeys } from '@/constants'
import { request } from '@/lib/request'
import {
  FuturesTransaction,
  UpdateFuturesTransactionDto,
} from '@/types/futures-transaction/futures-transaction'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const updateFuturesTransaction = (
  data: UpdateFuturesTransactionDto
): Promise<FuturesTransaction> =>
  request.put(`/futures-transaction/${data.id}`, data)

export const useUpdateFuturesTransaction = () => {
  const queryClient = useQueryClient()

  const {
    error,
    isPending: loading,
    mutateAsync: updateFuturesTransactionFn,
  } = useMutation({
    mutationFn: updateFuturesTransaction,
    onSuccess(data) {
      toast.success('更新成功')
      queryClient.invalidateQueries({
        queryKey: futuresTransactionKeys.lists(),
      })
      queryClient.setQueryData(futuresTransactionKeys.detail(data.id), data)
    },
  })

  return {
    updateFuturesTransaction: updateFuturesTransactionFn,
    loading,
    error,
  }
}
