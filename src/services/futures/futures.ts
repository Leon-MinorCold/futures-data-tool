import { request } from '@/lib/request'
import { Futures } from '@/types/futures/futures'
import { useQuery } from '@tanstack/react-query'

// Get all futures aata
export const getFutures = (): Promise<Futures[]> => request.get('/futures')

export const useFutures = () => {
  const {
    error,
    isPending: loading,
    data: futures,
    refetch,
  } = useQuery({
    queryKey: ['futures'],
    queryFn: getFutures,
  })

  return {
    futures,
    loading,
    error,
    refetch,
  }
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
    queryKey: ['futures', id],
    queryFn: () => getFuturesData(id),
  })

  return {
    futuresData,
    loading,
    error,
  }
}
