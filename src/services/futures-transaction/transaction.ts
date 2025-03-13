import { PaginatedResponse } from '@/types/common'
import {
  FuturesTransaction,
  GetAllFuturesTransactionDto,
  GetPaginatedFuturesTransactionDto,
} from '@/types/futures-transaction/futures-transaction'
import { request } from '@/lib/request'
import { useQuery } from '@tanstack/react-query'
import { futuresTransactionKeys } from '@/constants'

export const getAllFuturesTransactions = (
  params: GetAllFuturesTransactionDto
): Promise<FuturesTransaction[]> =>
  request.get('/futures-transaction/all', {
    params,
  })

export const useAllFuturesTransactions = (
  filters: GetAllFuturesTransactionDto
) => {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: futuresTransactionKeys.list(filters),
    queryFn: async () => {
      const list = await getAllFuturesTransactions(filters)
      // FixMe: 这里parse之后没数据
      // const _list = list.map((item) => futuresTransactionSchema.parse(item))
      return {
        list,
      }
    },
    refetchOnMount: true,
  })

  return {
    data,
    loading,
    error,
    refetch,
  }
}

export const getPaginatedFuturesTransactions = (
  params: GetPaginatedFuturesTransactionDto
): Promise<PaginatedResponse<FuturesTransaction[]>> =>
  request.get('/futures-transaction', {
    params,
  })

export const usePaginatedFuturesTransactions = (
  filters: GetPaginatedFuturesTransactionDto
) => {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: futuresTransactionKeys.list(filters),
    queryFn: async () => {
      const { list, pagination } =
        await getPaginatedFuturesTransactions(filters)
      return {
        list,
        pagination,
      }
    },
    refetchOnMount: true,
  })
  return {
    data,
    loading,
    error,
    refetch,
  }
}
