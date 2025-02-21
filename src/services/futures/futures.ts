import { request } from '@/lib/request'
import { PaginatedResponse } from '@/types/common'
import {
  Futures,
  futuresSchema,
  getPaginatedFuturesDto,
  getAllFuturesDto,
} from '@/types/futures/futures'
import { useQuery } from '@tanstack/react-query'
import { futuresKeys } from '@/constants/query-keys'

// Get all futures data
export const getAllFutures = (
  params?: getAllFuturesDto
): Promise<{ list: Futures[] }> =>
  request.get('/futures/all', {
    params,
  })

export const useAllFutures = (filters?: getAllFuturesDto) => {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: futuresKeys.list(filters),
    queryFn: async () => {
      const data = await getAllFutures(filters)
      return data.list
    },
  })
  return {
    data,
    loading,
    error,
    refetch,
  }
}

// Get paginated futures data
export const getPaginatedFutures = (
  params: getPaginatedFuturesDto
): Promise<PaginatedResponse<Futures>> =>
  request.get('/futures', {
    params,
  })

export const usePaginatedFutures = (filters: getPaginatedFuturesDto) => {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: futuresKeys.list(filters),
    queryFn: async () => {
      const { list, pagination } = await getPaginatedFutures(filters)
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
    isLoading: loading,
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
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: futuresKeys.detail(id),
    queryFn: () => getFuturesDetail(id),
    enabled: false,
  })

  return { data, loading, error, refetch }
}
