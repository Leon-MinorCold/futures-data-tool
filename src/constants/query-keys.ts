import { getAllFuturesDto } from '@/types/futures/futures'
import { UserListDto } from '@/types/user/user'
import type { QueryKey } from '@tanstack/react-query'

export const futuresKeys = {
  // 根级缓存键
  all: () => ['futures'] as const,

  // 列表相关
  lists: (): QueryKey => [...futuresKeys.all(), 'list'] as const,

  list: (filters: getAllFuturesDto): QueryKey =>
    [...futuresKeys.all(), 'list', filters] as const,

  // 详情相关
  details: (): QueryKey => [...futuresKeys.all(), 'detail'] as const,
  detail: (id: string): QueryKey => [...futuresKeys.details(), id] as const,
} satisfies Record<string, (...args: any[]) => QueryKey>

export const userKeys = {
  all: () => ['users'] as const,

  lists: (): QueryKey => [...userKeys.all(), 'user'] as const,
  list: (filter: UserListDto): QueryKey => [...userKeys.all(), 'list', filter],

  details: (): QueryKey => [...userKeys.all(), 'detail'] as const,
  detail: (id: string): QueryKey => [...userKeys.details(), id] as const,
} satisfies Record<string, (...args: any[]) => QueryKey>
