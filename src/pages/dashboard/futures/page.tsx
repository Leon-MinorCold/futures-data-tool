import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Helmet } from 'react-helmet-async'

import PageContainer from '@/layout/page-container'
import { usePaginatedFutures } from '@/services/futures/futures'
import { Futures } from '@/types/futures/futures'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Icons } from '@/components/ui/icons'
import { useState } from 'react'
import { FuturesFormDialog } from '@/pages/dashboard/futures/FuturesFormDialog'
import { DeleteAlertDialog } from './DeleteAlertDialog'
import { formatDateTime } from '@/lib/date'
import { Spinner } from '@/components/ui/spinner'

const FuturesPage = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { loading, data, refetch } = usePaginatedFutures({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
  })

  const list = data?.list || []
  const total = data?.pagination.total || 0

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingData, setEditingData] = useState<Futures | null>(null)

  const columns: ColumnDef<Futures>[] = [
    {
      accessorKey: 'id',
      header: () => {
        return '序号'
      },
      cell: ({ row, table }) => {
        const { pageIndex, pageSize } = table.getState().pagination
        return (
          <div className="text-center">
            {pageIndex * pageSize + row.index + 1}
          </div>
        )
      },
    },
    {
      accessorKey: 'name',
      header: '品种名称',
      cell: ({ row }) => {
        const futures = row.original
        return (
          <div className="capitalize">
            {row.getValue('name')}-{futures.code}
          </div>
        )
      },
    },
    {
      accessorKey: 'minPriceTick',
      header: '最小价格波动',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('minPriceTick')}元/吨</div>
      ),
    },
    {
      accessorKey: 'size',
      header: '期货交易规模',
      cell: ({ row }) => {
        const futures = row.original
        return (
          <div className="capitalize">
            {futures.size}
            {futures.unit}/手
          </div>
        )
      },
    },
    {
      accessorKey: 'tickValue',
      header: '每跳波动价格',
      cell: ({ row }) => {
        const origin = row.original
        const tickValue = origin.size * origin.minPriceTick || 0
        return <div className="capitalize">{tickValue}元</div>
      },
    },
    {
      accessorKey: 'fee',
      header: '手续费',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('fee')}元</div>
      ),
    },

    {
      accessorKey: 'exchange',
      header: '交易所',
    },

    {
      accessorKey: 'createdAt',
      header: '创建时间',
      cell: ({ row }) => formatDateTime(row.getValue('createdAt')),
    },
    {
      accessorKey: 'updatedAt',
      header: '更新时间',
      cell: ({ row }) => formatDateTime(row.getValue('updatedAt')),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const futures = row.original

        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditingData(futures)
                setDialogOpen(true)
              }}
            >
              编辑
            </Button>
            <DeleteAlertDialog futuresId={futures.id} />
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: list || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    manualPagination: true,
    pageCount: Math.ceil(total / pagination.pageSize),
  })

  return (
    <PageContainer>
      <Helmet>
        <title>期货数据列表</title>
      </Helmet>
      <div className="flex flex-row-reverse mb-4">
        <Button
          size="sm"
          onClick={() => {
            setEditingData(null)
            setDialogOpen(true)
          }}
        >
          <Icons.add />
          新增期货数据
        </Button>
      </div>

      <Spinner loading={loading}>
        <div className="rounded-md border mb-2">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Spinner>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">每页</span>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            显示第 {pagination.pageIndex * pagination.pageSize + 1} -{' '}
            {Math.min((pagination.pageIndex + 1) * pagination.pageSize, total)}
            条， 共 {total} 条
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            下一页
          </Button>
        </div>
      </div>

      <FuturesFormDialog
        key={editingData?.id || 'create'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingData}
      />
    </PageContainer>
  )
}

export default FuturesPage
