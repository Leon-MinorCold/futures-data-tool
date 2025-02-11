import { futuresKeys } from '@/constants'
import { request } from '@/lib/request'
import { PaginatedResponse } from '@/types/common'
import {
  Futures,
  futuresSchema,
  getAllFuturesDto,
} from '@/types/futures/futures'
import { useQuery } from '@tanstack/react-query'
import { futuresKeys as queryKeys } from '@/constants/query-keys'

// Get all futures aata
export const getFutures = (
  params: getAllFuturesDto
): Promise<PaginatedResponse<Futures>> =>
  request.get('/futures', {
    params,
  })

export const useFutures = (filters: getAllFuturesDto) => {
  const {
    data,
    isPending: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.list(filters),
    queryFn: async () => {
      const { list, pagination } = await getFutures(filters)
      const _list = list.map((item) => futuresSchema.parse(item))
      return {
        list: _list,
        pagination,
      }
    },
  })

  return { data, loading, error, refetch }
}

// get a futures data
export const getFuturesData = (id: string): Promise<Futures> =>
  request.get(`/futures/${id}`)

export const useFuturesData = (id: string) => {
  const {
    error,
    isPending: loading,
    data: futuresData,
  } = useQuery({
    queryKey: futuresKeys.detail(id),
    queryFn: () => getFuturesData(id),
  })

  return {
    futuresData,
    loading,
    error,
  }
}

// 获取单个期货详情
export const getFuturesDetail = (id: string): Promise<Futures> =>
  request.get(`/futures/${id}`)

export const useFuturesDetail = (id: string) => {
  const {
    data,
    isPending: loading,
    error,
  } = useQuery({
    queryKey: futuresKeys.detail(id),
    queryFn: () => getFuturesDetail(id),
  })

  return { data, loading, error }
}
