import { PaginatedResponse } from '@/types/common'
import {
  FuturesTransaction,
  GetFuturesTransactionDto,
  futuresTransactionSchema,
} from './../../types/futures-transaction/futures-transaction'
import { request } from '@/lib/request'
import { useQuery } from '@tanstack/react-query'
import { futuresTransactionKeys } from '@/constants'

export const getFuturesTransactions = (
  params: GetFuturesTransactionDto
): Promise<PaginatedResponse<FuturesTransaction[]>> =>
  request.get('/futures-transaction', {
    params,
  })

export const useFuturesTransactions = (filters: GetFuturesTransactionDto) => {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: futuresTransactionKeys.list(filters),
    queryFn: async () => {
      const { list, pagination } = await getFuturesTransactions(filters)
      // FixMe: 这里parse之后没数据
      // const _list = list.map((item) => futuresTransactionSchema.parse(item))
      return {
        list,
        pagination,
      }
    },
  })

  return {
    data,
    loading,
    error,
    refetch,
  }
}
