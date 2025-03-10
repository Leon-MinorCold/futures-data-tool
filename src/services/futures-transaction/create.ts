import { futuresTransactionKeys } from '@/constants'
import { request } from '@/lib/request'
import {
  CreateFuturesTransactionDto,
  FuturesTransaction,
} from '@/types/futures-transaction/futures-transaction'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const createFuturesTransaction = (
  data: CreateFuturesTransactionDto
): Promise<FuturesTransaction> => request.post('/futures-transaction', data)

export const useCreateFuturesTransaction = () => {
  const queryClient = useQueryClient()

  const {
    error,
    isPending: loading,
    mutateAsync: createFuturesTransactionFn,
  } = useMutation({
    mutationFn: createFuturesTransaction,
    onSuccess(data) {
      toast.success('新增交易记录成功')
      queryClient.invalidateQueries({
        queryKey: futuresTransactionKeys.lists(),
        // FixBug: 解决在其他页面创建交易记录后，交易记录没有刷新的问题
        exact: false,
      })
      queryClient.setQueryData(futuresTransactionKeys.detail(data.id), data)
    },
  })

  return {
    createFuturesTransaction: createFuturesTransactionFn,
    loading,
    error,
  }
}
