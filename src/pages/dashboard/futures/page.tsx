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

import PageContainer from '@/layout/page-container'
import { useFutures } from '@/services/futures/futures'
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

const FuturesPage = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { loading, data, refetch } = useFutures({
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
      accessorKey: 'contractName',
      header: '品种名称',
      cell: ({ row }) => {
        const futures = row.original
        return (
          <div className="capitalize">
            {row.getValue('contractName')}-{futures.contractCode}
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
      accessorKey: 'tickValue',
      header: '每跳波动价格',
      cell: ({ row }) => {
        return <div className="capitalize">{row.getValue('tickValue')}元</div>
      },
    },
    {
      accessorKey: 'tradeFee',
      header: '手续费',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('tradeFee')}元</div>
      ),
    },

    {
      accessorKey: 'exchange',
      header: '交易所',
    },
    {
      accessorKey: 'contractUnitValue',
      header: '期货交易单位',
      cell: ({ row }) => {
        const futures = row.original
        return (
          <div className="capitalize">
            {futures.contractUnitValue}
            {futures.contractUnitType}/手
          </div>
        )
      },
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
