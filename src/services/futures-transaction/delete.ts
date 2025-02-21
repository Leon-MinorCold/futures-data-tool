import { futuresTransactionKeys } from '@/constants'
import { request } from '@/lib/request'
import { FuturesTransaction } from '@/types/futures-transaction/futures-transaction'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const deleteFuturesTransaction = (
  id: string
): Promise<FuturesTransaction> => request.delete(`/futures-transaction/${id}`)

export const useDeleteFuturesTransaction = () => {
  const queryClient = useQueryClient()
  const {
    error,
    isPending: loading,
    mutateAsync: deleteFuturesTransactionFn,
  } = useMutation({
    mutationFn: deleteFuturesTransaction,
    onSuccess(_, id: string) {
      toast.success('删除成功')
      queryClient.invalidateQueries({
        queryKey: futuresTransactionKeys.lists(),
      })

      queryClient.invalidateQueries({
        queryKey: futuresTransactionKeys.detail(id),
      })
    },
  })

  return {
    deleteFuturesTransaction: deleteFuturesTransactionFn,
    loading,
    error,
  }
}
